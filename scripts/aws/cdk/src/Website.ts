import { type Construct } from 'constructs';
import { Stack, type StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as elb from 'aws-cdk-lib/aws-elasticloadbalancingv2';

import { priority } from './priority';

import { type ECS } from './ECS';
import { type LoadBalancer } from './LoadBalancer';

interface Props extends StackProps {
  ecs: ECS;
  lb: LoadBalancer;
}

function createTaskPolicy(): iam.PolicyDocument {
  const policyDocument = new iam.PolicyDocument();

  const ps = new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
  });
  ps.addActions('s3:*');
  ps.addResources('arn:aws:s3:::lwjgl-build', 'arn:aws:s3:::lwjgl-build/*');

  policyDocument.addStatements(ps);
  return policyDocument;
}

export class Website extends Stack {
  public readonly service: ecs.Ec2Service;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id, props);

    const serviceName = 'lwjgl-www';

    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcName: 'lwjgl-vpc',
    });

    const taskRole = new iam.Role(this, `${id}-role`, {
      roleName: `${id}-role`,
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      // managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerServiceTaskRole')],
      inlinePolicies: {
        [`${id}-www-policy`]: createTaskPolicy(),
      },
    });

    const taskDefinition = new ecs.Ec2TaskDefinition(this, `${id}-task-def`, {
      // executionRole,
      taskRole,
      family: serviceName,
    });

    const image = new ecs.RepositoryImage('ghcr.io/lwjgl/lwjgl3-www/lwjgl-website:latest');

    const logGroup = new logs.LogGroup(this, `${id}-log-group`, {
      logGroupName: '/ecs/website',
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const containerDef = new ecs.ContainerDefinition(this, `${id}-container-def`, {
      taskDefinition,
      image,
      memoryLimitMiB: 384,
      essential: true,
      logging: new ecs.AwsLogDriver({
        logGroup,
        streamPrefix: 'ecs',
      }),
    });
    containerDef.addPortMappings({
      containerPort: 80,
      hostPort: 0,
      protocol: ecs.Protocol.TCP,
    });

    const service = new ecs.Ec2Service(this, serviceName, {
      serviceName,
      cluster: props.ecs.cluster,
      taskDefinition,
      daemon: false,
      enableECSManagedTags: true,
      desiredCount: 2,
      minHealthyPercent: 50,
      maxHealthyPercent: 100,
      healthCheckGracePeriod: Duration.seconds(10),
      placementStrategies: [
        ecs.PlacementStrategy.spreadAcross(ecs.BuiltInAttributes.AVAILABILITY_ZONE, ecs.BuiltInAttributes.INSTANCE_ID),
      ],
    });

    const wwwTrg = new elb.ApplicationTargetGroup(this, 'lwjgl-org-tg', {
      vpc,
      targetGroupName: 'ecs-lwjgl',
      targets: [service],
      port: 80,
      deregistrationDelay: Duration.seconds(5),
      healthCheck: {
        enabled: true,
        path: '/health',
        timeout: Duration.seconds(2),
        healthyThresholdCount: 2,
        unhealthyThresholdCount: 2,
      },
    });

    new elb.ApplicationListenerRule(this, 'alb-listener-rule', {
      listener: props.lb.listener443,
      priority: priority('elb-443'),
      conditions: [elb.ListenerCondition.hostHeaders(['www.lwjgl.org'])],
      action: elb.ListenerAction.forward([wwwTrg]),
    });

    this.service = service;
  }
}
