import { type Construct } from 'constructs';
import { Stack, type StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ecs from 'aws-cdk-lib/aws-ecs';

export class ECS extends Stack {
  public readonly cluster: ecs.Cluster;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'vpc', {
      vpcName: 'lwjgl-vpc',
    });

    // ECS Cluster
    const securityGroup = new ec2.SecurityGroup(this, 'asg-sec-group', {
      vpc,
      description: 'ECS Cluster ASG Security Group',
      securityGroupName: 'ecs-asg-sg',
      // allowAllOutbound: false,
    });

    securityGroup.addIngressRule(ec2.Peer.ipv4(vpc.vpcCidrBlock), ec2.Port.allTraffic(), 'Allow internal IPv4 Traffic');
    securityGroup.addIngressRule(
      ec2.Peer.ipv6('2600:1f18:14f5:1500::/56'),
      ec2.Port.allTraffic(),
      'Allow internal IPv6 Traffic'
    );

    // ! Not needed since allowAllOutbound defaults to true
    // securityGroup.addEgressRule(ec2.Peer.ipv4('0.0.0.0/0'), ec2.Port.allTraffic());
    // securityGroup.addEgressRule(ec2.Peer.ipv6('::/0'), ec2.Port.allTraffic());

    const asgRole = new iam.Role(this, `asg-role`, {
      roleName: `ecs-asg-role`,
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2ContainerServiceforEC2Role'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
      ],
    });

    const asg = new autoscaling.AutoScalingGroup(this, 'asg', {
      vpc,
      autoScalingGroupName: `${id}-cluster-autoscaling-group`,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.STANDARD, {
        cachedInContext: false,
      }),
      securityGroup,
      role: asgRole,
      minCapacity: 1,
      desiredCapacity: 1,
      maxCapacity: 2,
      allowAllOutbound: true,
      associatePublicIpAddress: true,
    });
    const capacityProvider = new ecs.AsgCapacityProvider(this, 'capacityProvider', {
      autoScalingGroup: asg,
      capacityProviderName: 'website-capacity-provider',
    });
    const cluster = new ecs.Cluster(this, 'cluster', {
      vpc,
      clusterName: 'lwjgl-cluster',
      containerInsights: true,
    });
    cluster.addAsgCapacityProvider(capacityProvider);

    this.cluster = cluster;
  }
}
