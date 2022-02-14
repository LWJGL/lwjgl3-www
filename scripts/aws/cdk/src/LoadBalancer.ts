import { type Construct } from 'constructs';
import { Stack, type StackProps, Duration } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import { priority } from './priority';

import { type Route53Zones } from './Route53Zones';

interface Props extends StackProps {
  route53Zones: Route53Zones;
}

export class LoadBalancer extends Stack {
  public readonly elb: elbv2.ApplicationLoadBalancer;
  public readonly listener80: elbv2.ApplicationListener;
  public readonly listener443: elbv2.ApplicationListener;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const { route53Zones } = props;

    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcName: 'lwjgl-vpc',
    });

    const securityGroup = new ec2.SecurityGroup(this, 'elb-sec-group', {
      vpc,
      description: 'ELB Security Group',
      securityGroupName: 'lwjgl-elb',
    });

    securityGroup.addIngressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(80), 'Allow IPv4 HTTP');
    securityGroup.addIngressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.tcp(443), 'Allow IPv4 HTTPS');
    securityGroup.addIngressRule(ec2.Peer.ipv6('::/0'), ec2.Port.tcp(80), 'Allow IPv6 HTTP');
    securityGroup.addIngressRule(ec2.Peer.ipv6('::/0'), ec2.Port.tcp(443), 'Allow IPv6 HTTPS');

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_elasticloadbalancingv2.ApplicationLoadBalancer.html
    const lb = new elbv2.ApplicationLoadBalancer(this, 'elb', {
      vpc,
      securityGroup,
      loadBalancerName: 'lwjgl-public',
      idleTimeout: Duration.seconds(60),
      ipAddressType: elbv2.IpAddressType.DUAL_STACK,
      // deletionProtection: true,
      internetFacing: true,
      http2Enabled: true,
    });

    // https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#load-balancer-attributes
    lb.setAttribute('routing.http.desync_mitigation_mode', 'defensive');
    lb.setAttribute('routing.http.drop_invalid_header_fields.enabled', 'true');
    lb.setAttribute('routing.http.x_amzn_tls_version_and_cipher_suite.enabled', 'true');
    // loadbalancer.setAttribute('waf.fail_open.enabled', 'true');

    // HTTP Listener

    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_elasticloadbalancingv2.BaseApplicationListenerProps.html
    const listener = lb.addListener('elb-80', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultAction: elbv2.ListenerAction.fixedResponse(404, { contentType: 'text/plain' }),
    });

    new elbv2.ApplicationListenerRule(this, 'lwjgl-com-redirect', {
      listener,
      priority: priority('elb-80'),
      conditions: [elbv2.ListenerCondition.hostHeaders(['lwjgl.com', 'www.lwjgl.com'])],
      action: elbv2.ListenerAction.redirect({
        host: 'www.lwjgl.org',
        protocol: elbv2.ApplicationProtocol.HTTPS,
        port: '443',
        path: '/#{path}',
        query: '#{query}',
        permanent: true,
      }),
    });

    new elbv2.ApplicationListenerRule(this, 'lwjgl-org-blog-redirect', {
      listener,
      priority: priority('elb-80'),
      conditions: [elbv2.ListenerCondition.hostHeaders(['blog.lwjgl.org'])],
      action: elbv2.ListenerAction.redirect({
        host: 'blog.lwjgl.org',
        protocol: elbv2.ApplicationProtocol.HTTPS,
        port: '443',
        path: '/#{path}',
        query: '#{query}',
        permanent: true,
      }),
    });

    const redirectToSlack = elbv2.ListenerAction.redirect({
      host: 'join.slack.com',
      protocol: elbv2.ApplicationProtocol.HTTPS,
      port: '443',
      path: '/t/lwjgl/shared_invite/enQtODI1MTY2MzE4MDk4LWE5ZjU5OTA0N2VmOWMxNDA1YjRlMTI3NzA0ZWMyYjFkYzI0NGIxMDI4ZTA0ODcxYWQ1MzI4YWRiYTFjNTMyODE',
      query: '#{query}',
      permanent: true,
    });
    new elbv2.ApplicationListenerRule(this, 'lwjgl-org-slack-redirect', {
      listener,
      priority: priority('elb-80'),
      conditions: [elbv2.ListenerCondition.hostHeaders(['slack.lwjgl.org'])],
      action: redirectToSlack,
    });

    // HTTPS Listener

    const listener443 = lb.addListener('elb-443', {
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [route53Zones.lwjglOrgCert, route53Zones.lwjglComCert],
      sslPolicy: elbv2.SslPolicy.FORWARD_SECRECY_TLS12_RES,
      defaultAction: elbv2.ListenerAction.fixedResponse(404, { contentType: 'text/plain' }),
    });

    // lwjgl.com redirects

    new elbv2.ApplicationListenerRule(this, 'lwjgl-com-redirect-443', {
      listener: listener443,
      priority: priority('elb-443'),
      conditions: [elbv2.ListenerCondition.hostHeaders(['lwjgl.com', 'www.lwjgl.com'])],
      action: elbv2.ListenerAction.redirect({
        host: 'www.lwjgl.org',
        protocol: elbv2.ApplicationProtocol.HTTPS,
        port: '443',
        path: '/#{path}',
        query: '#{query}',
        permanent: true,
      }),
    });

    // blog.lwjgl.org
    const blogTrg = new targets.IpTarget('10.0.38.144', 80);
    const blogTrgGroup = new elbv2.ApplicationTargetGroup(this, 'blog-tg', {
      vpc,
      targetGroupName: 'blog-tg',
      targetType: elbv2.TargetType.IP,
      targets: [blogTrg],
      port: 80,
      deregistrationDelay: Duration.seconds(5),
      loadBalancingAlgorithmType: elbv2.TargetGroupLoadBalancingAlgorithmType.ROUND_ROBIN,
      healthCheck: {
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 4,
        interval: Duration.seconds(10),
        timeout: Duration.seconds(5),
        path: '/health',
      },
    });
    new elbv2.ApplicationListenerRule(this, 'lwjgl-org-blog-443', {
      listener: listener443,
      priority: priority('elb-443'),
      conditions: [elbv2.ListenerCondition.hostHeaders(['blog.lwjgl.org'])],
      targetGroups: [blogTrgGroup],
    });

    new elbv2.ApplicationListenerRule(this, 'lwjgl-org-slack-redirect-443', {
      listener,
      priority: priority('elb-443'),
      conditions: [elbv2.ListenerCondition.hostHeaders(['slack.lwjgl.org'])],
      action: redirectToSlack,
    });

    this.elb = lb;
    this.listener80 = listener;
    this.listener443 = listener443;
  }
}
