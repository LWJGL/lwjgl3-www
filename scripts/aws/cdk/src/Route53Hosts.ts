import { type Construct } from 'constructs';
import { Stack, type StackProps, Duration } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as aws_cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { type Route53Zones } from './Route53Zones';
import { type LoadBalancer } from './LoadBalancer';
import { type Cloudfront } from './Cloudfront';

interface Props extends StackProps {
  route53Zones: Route53Zones;
  lb: LoadBalancer;
  cloudfront: Cloudfront;
}

export class Route53Hosts extends Stack {
  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const { route53Zones, lb, cloudfront } = props;

    const lbTrg = route53.RecordTarget.fromAlias(new targets.LoadBalancerTarget(lb.elb));

    // lwjgl.org

    {
      // We cannot use `cloudfront.build` here, because we cannot use Cloudfront distros in other stacks.
      const buildCdn = aws_cloudfront.Distribution.fromDistributionAttributes(this, 'build-cdn', {
        distributionId: cloudfront.build.distributionId,
        domainName: cloudfront.build.domainName,
      });
      new route53.ARecord(this, 'lwjgl-org-build-a', {
        zone: route53Zones.lwjglOrg,
        recordName: 'build',
        ttl: Duration.minutes(5),
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(buildCdn)),
      });
      new route53.AaaaRecord(this, 'lwjgl-org-build-aaaa', {
        zone: route53Zones.lwjglOrg,
        recordName: 'build',
        ttl: Duration.minutes(5),
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(buildCdn)),
      });

      const javadocCdn = aws_cloudfront.Distribution.fromDistributionAttributes(this, 'javadoc-cdn', {
        distributionId: cloudfront.javadoc.distributionId,
        domainName: cloudfront.javadoc.domainName,
      });
      new route53.ARecord(this, 'lwjgl-org-javadoc-a', {
        zone: route53Zones.lwjglOrg,
        recordName: 'javadoc',
        ttl: Duration.minutes(5),
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(javadocCdn)),
      });
      new route53.AaaaRecord(this, 'lwjgl-org-javadoc-aaaa', {
        zone: route53Zones.lwjglOrg,
        recordName: 'javadoc',
        ttl: Duration.minutes(5),
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(javadocCdn)),
      });

      const legacyCdn = aws_cloudfront.Distribution.fromDistributionAttributes(this, 'legacy-cdn', {
        distributionId: cloudfront.legacy.distributionId,
        domainName: cloudfront.legacy.domainName,
      });
      new route53.ARecord(this, 'lwjgl-org-legacy-a', {
        zone: route53Zones.lwjglOrg,
        recordName: 'legacy',
        ttl: Duration.minutes(5),
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(legacyCdn)),
      });
      new route53.AaaaRecord(this, 'lwjgl-org-legacy-aaaa', {
        zone: route53Zones.lwjglOrg,
        recordName: 'legacy',
        ttl: Duration.minutes(5),
        target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(legacyCdn)),
      });

      new route53.ARecord(this, 'lwjgl-org-blog-a', {
        zone: route53Zones.lwjglOrg,
        recordName: 'blog',
        ttl: Duration.minutes(5),
        target: lbTrg,
      });
      new route53.AaaaRecord(this, 'lwjgl-org-blog-aaaa', {
        zone: route53Zones.lwjglOrg,
        recordName: 'blog',
        ttl: Duration.minutes(5),
        target: lbTrg,
      });
      // new route53.ARecord(this, 'lwjgl-org-blog-a', {
      //   zone: route53Zones.lwjglOrg,
      //   recordName: 'blog',
      //   ttl: Duration.minutes(5),
      //   target: route53.RecordTarget.fromAlias(aliasTarget),
      // });
      // new route53.AaaaRecord(this, 'lwjgl-org-blog-aaaa', {
      //   zone: route53Zones.lwjglOrg,
      //   recordName: 'blog',
      //   ttl: Duration.minutes(5),
      //   target: route53.RecordTarget.fromAlias(),
      // });
      // new route53.ARecord(this, 'lwjgl-org-www-a', {
      //   zone: route53Zones.lwjglOrg,
      //   recordName: 'www',
      //   ttl: Duration.minutes(5),
      //   target: route53.RecordTarget.fromAlias(),
      // });
      // new route53.AaaaRecord(this, 'lwjgl-org-www-aaaa', {
      //   zone: route53Zones.lwjglOrg,
      //   recordName: 'www',
      //   ttl: Duration.minutes(5),
      //   target: route53.RecordTarget.fromAlias(),
      // });
    }

    // lwjgl.com
    {
      new route53.ARecord(this, 'lwjgl-com-a', {
        zone: route53Zones.lwjglCom,
        ttl: Duration.minutes(5),
        target: lbTrg,
      });
      new route53.AaaaRecord(this, 'lwjgl-com-aaaa', {
        zone: route53Zones.lwjglCom,
        ttl: Duration.minutes(5),
        target: lbTrg,
      });
      new route53.ARecord(this, 'lwjgl-com-www-a', {
        zone: route53Zones.lwjglCom,
        recordName: 'www',
        ttl: Duration.minutes(5),
        target: lbTrg,
      });
      new route53.AaaaRecord(this, 'lwjgl-org-www-aaaa', {
        zone: route53Zones.lwjglCom,
        recordName: 'www',
        ttl: Duration.minutes(5),
        target: lbTrg,
      });
    }
  }
}
