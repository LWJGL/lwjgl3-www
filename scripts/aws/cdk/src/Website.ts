import { type Construct } from 'constructs';
import { Stack, type StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';

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

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcName: 'lwjgl-vpc',
    });

    const cluster = new ecs.Cluster(this, 'cluster', {
      vpc,
      containerInsights: true,
      // clusterName: 'lwjgl-cluster',
      capacity: {
        instanceType: new ec2.InstanceType('t3.micro'),
        machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD, {
          cachedInContext: false,
        }),
        minCapacity: 1,
        desiredCapacity: 1,
        maxCapacity: 2,
        allowAllOutbound: true,
        associatePublicIpAddress: false,
        autoScalingGroupName: 'lwjgl-cluster-autoscaling',
        canContainersAccessInstanceRole: false,
      },
    });

    const taskRole = new iam.Role(this, `${id}-role`, {
      roleName: `${id}-role`,
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      // managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerServiceTaskRole')],
      inlinePolicies: {
        [`${id}-www-policy`]: createTaskPolicy(),
      },
    });

    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'website-task-def', {
      // executionRole,
      taskRole,
      family: 'lwjgl-www',
    });

    const image = new ecs.RepositoryImage('ghcr.io/lwjgl/lwjgl3-www/lwjgl-website:latest');

    const logGroup = new logs.LogGroup(this, 'website-log-group', {
      logGroupName: '/ecs/website',
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const containerDef = new ecs.ContainerDefinition(this, 'website-container-def', {
      taskDefinition,
      image,
      memoryLimitMiB: 512,
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

    const service = new ecs.Ec2Service(this, 'lwjgl-www', {
      serviceName: 'lwjgl-www',
      cluster,
      taskDefinition,
      daemon: false,
      enableECSManagedTags: true,
      desiredCount: 2,
      minHealthyPercent: 100,
      maxHealthyPercent: 300,
      healthCheckGracePeriod: Duration.seconds(10),
      placementStrategies: [
        ecs.PlacementStrategy.spreadAcross(ecs.BuiltInAttributes.AVAILABILITY_ZONE, ecs.BuiltInAttributes.INSTANCE_ID),
      ],
    });

    this.service = service;
  }
}
