import { type Construct } from 'constructs';
import { Stack, type StackProps, Duration } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';

import { type Route53Zones } from './Route53Zones';
import { type Website } from './Website';

interface Props extends StackProps {
  route53Zones: Route53Zones;
  website: Website;
}

export class LoadBalancer extends Stack {
  public readonly elb: elb.ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);
    const { route53Zones, website } = props;

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
    const lb = new elb.ApplicationLoadBalancer(this, 'elb', {
      vpc,
      securityGroup,
      loadBalancerName: 'lwjgl-public',
      idleTimeout: Duration.seconds(60),
      ipAddressType: elb.IpAddressType.DUAL_STACK,
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
      protocol: elb.ApplicationProtocol.HTTP,
      defaultAction: elb.ListenerAction.fixedResponse(404, { contentType: 'text/plain' }),
    });

    let priority = 0;

    priority += 1;
    new elb.ApplicationListenerRule(this, 'lwjgl-com-redirect', {
      listener,
      priority,
      conditions: [elb.ListenerCondition.hostHeaders(['lwjgl.com', 'www.lwjgl.com'])],
      action: elb.ListenerAction.redirect({
        host: 'www.lwjgl.org',
        protocol: elb.ApplicationProtocol.HTTPS,
        port: '443',
        path: '/#{path}',
        query: '#{query}',
        permanent: true,
      }),
    });

    priority += 1;
    new elb.ApplicationListenerRule(this, 'lwjgl-org-blog-redirect', {
      listener,
      priority,
      conditions: [elb.ListenerCondition.hostHeaders(['blog.lwjgl.org'])],
      action: elb.ListenerAction.redirect({
        host: 'blog.lwjgl.org',
        protocol: elb.ApplicationProtocol.HTTPS,
        port: '443',
        path: '/#{path}',
        query: '#{query}',
        permanent: true,
      }),
    });

    // HTTPS Listener

    const listener443 = lb.addListener('elb-443', {
      port: 443,
      protocol: elb.ApplicationProtocol.HTTPS,
      certificates: [route53Zones.lwjglOrgCert, route53Zones.lwjglComCert],
      sslPolicy: elb.SslPolicy.FORWARD_SECRECY_TLS12_RES,
      defaultAction: elb.ListenerAction.fixedResponse(404, { contentType: 'text/plain' }),
    });

    // reset priority
    priority = 0;

    // lwjgl.com redirects
    priority += 1;
    new elb.ApplicationListenerRule(this, 'lwjgl-com-redirect-443', {
      listener: listener443,
      priority,
      conditions: [elb.ListenerCondition.hostHeaders(['lwjgl.com', 'www.lwjgl.com'])],
      action: elb.ListenerAction.redirect({
        host: 'www.lwjgl.org',
        protocol: elb.ApplicationProtocol.HTTPS,
        port: '443',
        path: '/#{path}',
        query: '#{query}',
        permanent: true,
      }),
    });

    // blog.lwjgl.org
    priority += 1;
    const blogTrg = new targets.IpTarget('10.0.38.144', 80);
    const blogTrgGroup = new elb.ApplicationTargetGroup(this, 'blog-tg', {
      vpc,
      targetGroupName: 'blog-tg',
      targetType: elb.TargetType.IP,
      targets: [blogTrg],
      port: 80,
      deregistrationDelay: Duration.seconds(5),
      loadBalancingAlgorithmType: elb.TargetGroupLoadBalancingAlgorithmType.ROUND_ROBIN,
      healthCheck: {
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 4,
        interval: Duration.seconds(10),
        timeout: Duration.seconds(5),
        path: '/health',
      },
    });
    new elb.ApplicationListenerRule(this, 'lwjgl-org-blog-443', {
      listener: listener443,
      priority,
      conditions: [elb.ListenerCondition.hostHeaders(['blog.lwjgl.org'])],
      targetGroups: [blogTrgGroup],
    });

    // // www.lwjgl.org
    // const targetGroup = new elb.ApplicationTargetGroup(this, 'alb-target-group', {
    //   vpc,
    //   targetGroupName: 'ecs-lwjgl',
    //   targets: [service],
    //   port: 80,
    //   deregistrationDelay: Duration.seconds(10),
    //   healthCheck: {
    //     enabled: true,
    //     path: '/health',
    //     timeout: Duration.seconds(2),
    //     healthyThresholdCount: 2,
    //     unhealthyThresholdCount: 2,
    //   },
    // });

    // const listenerRule = new elb.ApplicationListenerRule(this, 'alb-listener-rule', {
    //   listener,
    //   priority: 7,
    //   conditions: [elb.ListenerCondition.hostHeaders(['www.lwjgl.org'])],
    //   action: elb.ListenerAction.forward([targetGroup]),
    // });

    // const listenerRuleRedirect = new elb.ApplicationListenerRule(this, 'alb-listener-rule-redirect', {
    //   listener,
    //   priority: 8,
    //   conditions: [elb.ListenerCondition.hostHeaders(['lwjgl.org'])],
    //   action: elb.ListenerAction.redirect({
    //     protocol: 'HTTPS',
    //     port: '443',
    //     host: 'www.lwjgl.org',
    //     path: '/#{path}',
    //     query: '#{query}',
    //     permanent: true,
    //   }),
    // });

    this.elb = lb;
  }
}
