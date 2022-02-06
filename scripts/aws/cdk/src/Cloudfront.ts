import { type Construct } from 'constructs';
import { Stack, type StackProps, Duration } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
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
  // public readonly blog: cloudfront.Distribution;
  // public readonly www: cloudfront.Distribution;

  /*
  legacy.lwjgl.org ?
  blog.lwjgl.org webhotelier-cloudfront-1235708253.us-east-1.elb.amazonaws.com  E2128JB5XYS0E	LWJGL	d3nky9zd86imt4.cloudfront.net
  www.lwjgl.org

    // const origin = new origins.HttpOrigin('origin.webhotelier.net', {
    //   protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
    //   httpPort: 80,
    //   connectionAttempts: 3,
    //   readTimeout: Duration.seconds(30),
    //   keepaliveTimeout: Duration.seconds(5),
    // });

*/

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const { s3, route53Zones, lb } = props;

    // Common
    const originRequestPolicyStatic = new cloudfront.OriginRequestPolicy(this, 'origin-policy-static-add-none', {
      originRequestPolicyName: 'StaticAddNone',
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
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
        accessControlAllowOrigins: ['https://www.lwjgl.org'],
        accessControlAllowCredentials: false,
        accessControlAllowHeaders: ['*'],
        accessControlAllowMethods: ['GET', 'HEAD', 'OPTIONS'],
        // accessControlExposeHeaders: ['*'],
        accessControlMaxAge: Duration.seconds(600),
        originOverride: true,
      },
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
  }
}
