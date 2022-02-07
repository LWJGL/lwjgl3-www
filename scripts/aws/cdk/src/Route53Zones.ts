import { type Construct } from 'constructs';
import { Stack, type StackProps, Duration } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class Route53Zones extends Stack {
  public readonly lwjglOrg: route53.PublicHostedZone;
  public readonly lwjglOrgCert: acm.Certificate;
  public readonly lwjglCom: route53.PublicHostedZone;
  public readonly lwjglComCert: acm.Certificate;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // lwjgl.org

    this.lwjglOrg = new route53.PublicHostedZone(this, 'lwjgl-org-zone', {
      zoneName: 'lwjgl.org',
    });
    {
      new route53.CaaAmazonRecord(this, 'lwjgl-org-ca', {
        zone: this.lwjglOrg,
        ttl: Duration.minutes(5),
      });

      // Zoho mail
      new route53.MxRecord(this, 'lwjgl-org-mx', {
        zone: this.lwjglOrg,
        values: [
          { priority: 10, hostName: 'mx.zohomail.com.' },
          { priority: 20, hostName: 'mx2.zohomail.com.' },
        ],
        ttl: Duration.minutes(5),
      });
      new route53.TxtRecord(this, 'lwjgl-org-txt', {
        zone: this.lwjglOrg,
        values: ['v=spf1 include:zoho.com ~all'],
        ttl: Duration.minutes(5),
      });
      new route53.CnameRecord(this, 'lwjgl-org-zoho-verification', {
        zone: this.lwjglOrg,
        recordName: 'zb14162486',
        domainName: 'zmverify.zoho.com',
        ttl: Duration.minutes(5),
      });
      new route53.TxtRecord(this, 'lwjgl-org-txt-zoho', {
        zone: this.lwjglOrg,
        recordName: 'zoho._domainkey',
        values: [
          'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCvF7G1YBWN66U7VCVVtNy68njp8tbbEXp4+LXV6AeyGb8hfIwQKj+/Mjip4F+cGpDw8acrpvVn8XFoRfIOjw5aeDiV12iuM5+GfIOgKe2HAWciTGOF5MhEWYGHFhN6BsIg13lxkRakKdIqQITGokX8Rm5kFiAQwS94NeZfpoaQ5QIDAQAB',
        ],
        ttl: Duration.minutes(5),
      });

      // Google
      new route53.CnameRecord(this, 'lwjgl-org-googlehosted-verification', {
        zone: this.lwjglOrg,
        recordName: 'l3y4pwc6knwy',
        domainName: 'gv-n5dybj7f4rmxmr.dv.googlehosted.com',
        ttl: Duration.minutes(5),
      });

      // Github
      new route53.TxtRecord(this, 'lwjgl-org-txt-github', {
        zone: this.lwjglOrg,
        recordName: '_github-challenge-lwjgl',
        values: ['605b9df522'],
        ttl: Duration.minutes(5),
        comment: 'Github verification',
      });
      new route53.TxtRecord(this, 'www-lwjgl-org-txt-github', {
        zone: this.lwjglOrg,
        recordName: '_github-challenge-lwjgl.www',
        values: ['419304127e'],
        ttl: Duration.minutes(5),
        comment: 'Github verification',
      });

      // Hosts
      new route53.ARecord(this, 'forum-lwjgl-org', {
        zone: this.lwjglOrg,
        recordName: 'forum',
        target: route53.RecordTarget.fromIpAddresses('52.6.78.255'),
        ttl: Duration.minutes(5),
      });
      new route53.ARecord(this, 'slack-lwjgl-org', {
        zone: this.lwjglOrg,
        recordName: 'slack',
        target: route53.RecordTarget.fromIpAddresses('52.6.78.255'),
        ttl: Duration.minutes(5),
      });
    }

    // lwjgl.com

    this.lwjglCom = new route53.PublicHostedZone(this, 'lwjgl-com-zone', {
      zoneName: 'lwjgl.com',
    });
    {
      new route53.CaaAmazonRecord(this, 'lwjgl-com-ca', {
        zone: this.lwjglCom,
        ttl: Duration.minutes(5),
      });
      new route53.TxtRecord(this, 'lwjgl-com-txt-github', {
        zone: this.lwjglCom,
        recordName: '_github-challenge-lwjgl',
        values: ['a7afa5ddf9'],
        ttl: Duration.minutes(5),
        comment: 'Github verification',
      });
    }

    // Issue Certificates
    this.lwjglOrgCert = new acm.DnsValidatedCertificate(this, 'lwjgl-org-cert', {
      domainName: '*.lwjgl.org',
      hostedZone: this.lwjglOrg,
      subjectAlternativeNames: ['lwjgl.org'],
    });

    this.lwjglComCert = new acm.DnsValidatedCertificate(this, 'lwjgl-com-cert', {
      domainName: '*.lwjgl.com',
      hostedZone: this.lwjglCom,
      subjectAlternativeNames: ['lwjgl.com'],
    });
  }
}
