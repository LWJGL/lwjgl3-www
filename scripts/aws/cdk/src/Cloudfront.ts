import * as path from 'node:path';
import { type Construct } from 'constructs';
import { Stack, type StackProps, Duration } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as sm from 'aws-cdk-lib/aws-secretsmanager';
import { type S3 } from './S3';
import { type Route53Zones } from './Route53Zones';
import { type LoadBalancer } from './LoadBalancer';

interface Props extends StackProps {
  s3: S3;
  route53Zones: Route53Zones;
  lb: LoadBalancer;
}

export class Cloudfront extends Stack {
  public readonly build: cloudfront.Distribution;
  public readonly javadoc: cloudfront.Distribution;
  public readonly legacy: cloudfront.Distribution;
  public readonly www: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const { s3, route53Zones, lb } = props;

    // Common
    const originRequestPolicyStatic = new cloudfront.OriginRequestPolicy(this, 'origin-policy-static-add-none', {
      originRequestPolicyName: 'StaticAddNone',
      cookieBehavior: cloudfront.OriginRequestCookieBehavior.none(),
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.none(),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.none(),
    });

    const responseHeadersPolicyStaticImmutable = new cloudfront.ResponseHeadersPolicy(
      this,
      'response-headers-policy-static-immutable',
      {
        responseHeadersPolicyName: 'StaticImmutable',
        customHeadersBehavior: {
          customHeaders: [{ header: 'Cache-Control', value: 'public,max-age=31536000,immutable', override: true }],
        },
        securityHeadersBehavior: {
          // contentSecurityPolicy: { contentSecurityPolicy: 'default-src https:;', override: true },
          contentTypeOptions: { override: true },
          // frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
          referrerPolicy: { referrerPolicy: cloudfront.HeadersReferrerPolicy.ORIGIN_WHEN_CROSS_ORIGIN, override: true },
          strictTransportSecurity: {
            accessControlMaxAge: Duration.seconds(3600),
            includeSubdomains: true,
            override: true,
          },
          xssProtection: {
            protection: true,
            modeBlock: true,
            // reportUri: 'https://example.com/csp-report',
            override: true,
          },
        },
      }
    );

    const responseHeadersPolicyStatic = new cloudfront.ResponseHeadersPolicy(this, 'response-headers-policy-static', {
      responseHeadersPolicyName: 'Static',
      comment: 'Used in build and javadoc CDN',
      customHeadersBehavior: {
        customHeaders: [{ header: 'Cache-Control', value: 'public,max-age=86400', override: false }],
      },
      securityHeadersBehavior: {
        // contentSecurityPolicy: { contentSecurityPolicy: 'default-src https:;', override: true },
        contentTypeOptions: { override: true },
        // frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        referrerPolicy: { referrerPolicy: cloudfront.HeadersReferrerPolicy.ORIGIN_WHEN_CROSS_ORIGIN, override: true },
        strictTransportSecurity: {
          accessControlMaxAge: Duration.seconds(3600),
          includeSubdomains: true,
          override: true,
        },
        xssProtection: {
          protection: true,
          modeBlock: true,
          // reportUri: 'https://example.com/csp-report',
          override: true,
        },
      },
      corsBehavior: {
        accessControlAllowOrigins: ['https://www.lwjgl.org', 'http://www.lwjgl.localhost'],
        accessControlAllowCredentials: false,
        accessControlAllowHeaders: ['*'],
        accessControlAllowMethods: ['GET', 'HEAD', 'OPTIONS'],
        // accessControlExposeHeaders: ['*'],
        accessControlMaxAge: Duration.seconds(600),
        originOverride: true,
      },
    });

    const responseHeadersPolicyDynamic = new cloudfront.ResponseHeadersPolicy(this, 'response-headers-policy-dynamic', {
      responseHeadersPolicyName: 'Dynamic',
      comment: 'Used in LWJGL website',
      securityHeadersBehavior: {
        // contentSecurityPolicy: { contentSecurityPolicy: 'default-src https:;', override: true },
        contentTypeOptions: { override: true },
        // frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
        referrerPolicy: {
          referrerPolicy: cloudfront.HeadersReferrerPolicy.NO_REFERRER_WHEN_DOWNGRADE,
          override: false,
        },
        strictTransportSecurity: {
          accessControlMaxAge: Duration.seconds(3600),
          includeSubdomains: true,
          override: true,
        },
        xssProtection: {
          protection: true,
          modeBlock: true,
          // reportUri: 'https://example.com/csp-report',
          override: true,
        },
      },
    });

    const cachePolicyDynamic = new cloudfront.CachePolicy(this, 'cache-policy-dynamic', {
      cachePolicyName: 'OriginControlledCacheNoCookies',
      comment: 'Allows for origin-controlled caching. Cache based on Host,Accept + Query. Cookies ignored',
      minTtl: Duration.seconds(0),
      maxTtl: Duration.seconds(31536000),
      defaultTtl: Duration.hours(24),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Accept', 'Host'),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });

    const cachePolicyDownloads = new cloudfront.CachePolicy(this, 'cache-policy-build', {
      cachePolicyName: 'DownloadBuilds',
      minTtl: Duration.seconds(0),
      maxTtl: Duration.seconds(31536000),
      defaultTtl: Duration.hours(24),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
    });

    this.build = new cloudfront.Distribution(this, 'DistributionBuild', {
      domainNames: ['build.lwjgl.org'],
      certificate: route53Zones.lwjglOrgCert,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      comment: 'Build',
      enabled: true,
      enableIpv6: true,
      enableLogging: false,
      defaultBehavior: {
        origin: new origins.S3Origin(s3.build, {
          originShieldRegion: 'us-east-1',
        }),
        compress: true,
        smoothStreaming: false,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cachePolicyDownloads,
        originRequestPolicy: originRequestPolicyStatic,
        responseHeadersPolicy: responseHeadersPolicyStatic,
      },
    });

    this.javadoc = new cloudfront.Distribution(this, 'DistributionJavadoc', {
      domainNames: ['javadoc.lwjgl.org'],
      certificate: route53Zones.lwjglOrgCert,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      comment: 'Javadoc',
      enabled: true,
      enableIpv6: true,
      enableLogging: false,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3Origin(s3.javadoc, {
          originShieldRegion: 'us-east-1',
        }),
        compress: true,
        smoothStreaming: false,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: originRequestPolicyStatic,
        responseHeadersPolicy: responseHeadersPolicyStatic,
      },
    });

    this.legacy = new cloudfront.Distribution(this, 'DistributionLegacy', {
      domainNames: ['legacy.lwjgl.org'],
      certificate: route53Zones.lwjglOrgCert,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      comment: 'LWJGL2 Website',
      enabled: true,
      enableIpv6: true,
      enableLogging: false,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.S3Origin(s3.legacy, {
          originShieldRegion: 'us-east-1',
        }),
        compress: true,
        smoothStreaming: false,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        originRequestPolicy: originRequestPolicyStatic,
        responseHeadersPolicy: responseHeadersPolicyStaticImmutable,
      },
    });

    const originProtectionSecret = sm.Secret.fromSecretAttributes(this, 'origin-secret', {
      secretCompleteArn: 'arn:aws:secretsmanager:us-east-1:770058214810:secret:lwjgl/cloudfront/origin-verify-rXJORe',
    });

    const wwwViewerRequest = new cloudfront.Function(this, 'www-function', {
      functionName: 'www-viewer-request',
      code: cloudfront.FunctionCode.fromFile({
        filePath: path.join(__dirname, '../../cloudfront-viewer-request/index.js'),
      }),
    });

    const originRequestPolicyWww = new cloudfront.OriginRequestPolicy(this, 'origin-policy-www', {
      originRequestPolicyName: 'Website',
      cookieBehavior: cloudfront.OriginRequestCookieBehavior.none(),
      // https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-cloudfront-headers.html
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.all(
        // 'CloudFront-Viewer-Address',
        // 'CloudFront-Viewer-Country',
        'CloudFront-Forwarded-Proto'
      ),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.allowList('path'),
    });

    this.www = new cloudfront.Distribution(this, 'DistributionWww', {
      domainNames: ['www.lwjgl.org', 'lwjgl.org'],
      certificate: route53Zones.lwjglOrgCert,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2019,
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      comment: 'LWJGL3 Website',
      enabled: true,
      enableIpv6: true,
      enableLogging: false,
      // defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new origins.LoadBalancerV2Origin(lb.elb, {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          keepaliveTimeout: Duration.seconds(30),
          readTimeout: Duration.seconds(30),
          originShieldRegion: 'us-east-1',
          customHeaders: {
            'X-Origin-Verify': originProtectionSecret.secretValue.toString(),
          },
        }),
        compress: true,
        smoothStreaming: false,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD_OPTIONS,
        cachePolicy: cachePolicyDynamic,
        originRequestPolicy: originRequestPolicyWww,
        responseHeadersPolicy: responseHeadersPolicyDynamic,
        functionAssociations: [
          {
            function: wwwViewerRequest,
            eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          },
        ],
      },
    });

    const originCdn = new origins.S3Origin(s3.cdn, {
      originShieldRegion: 'us-east-1',
    });

    const originCdnBehavior: cloudfront.AddBehaviorOptions = {
      compress: true,
      smoothStreaming: false,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
      allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
      cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      originRequestPolicy: originRequestPolicyStatic,
      responseHeadersPolicy: responseHeadersPolicyStaticImmutable,
    };

    this.www.addBehavior('js/*', originCdn, originCdnBehavior);
    this.www.addBehavior('img/*', originCdn, originCdnBehavior);
    this.www.addBehavior('svg/*', originCdn, originCdnBehavior);
  }
}
