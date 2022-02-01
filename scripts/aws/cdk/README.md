## Common commands

```bash
cdk --profile lwjgl synth
cdk --profile lwjgl deploy --all --no-rollback
cdk --profile lwjgl deploy <name>
```

## Stacks

```bash
cdk --profile lwjgl deploy Cloudfront
cdk --profile lwjgl deploy LoadBalancer
cdk --profile lwjgl deploy DNS
cdk --profile lwjgl deploy S3
```

## Prerequisites

- Node.js
- aws-cdk (`npm -g i aws-cdk`)

## Initial Setup

1. Create `~/.aws/config` and `~/.aws/credentials` files with a profile named `lwjgl`.

2. Boostrap CDK with:

```bash
cdk bootstrap --profile lwjgl
```

3. To verify that requests are coming from Cloudfront:

- Log in to AWS console and open Secrets Manager.
- Create a new secret named `lwjgl/cloudfront/origin-verify`
- Enter a Plaintext value for the private key (any secure password will do).

4. VPC

Delete the default VPC
Create a non-default VPC with Amazon-provided IPv6 CIDR block. It's name should be `lwjgl-vpc`
CIDR should be: 10.0.0.0/16
Also create at least two subnets
NOTE: We do this manually because CDK does not yet support creating IPv6-enabled VPCs.

```bash
VPC_ID=`aws --profile lwjgl ec2 describe-vpcs --filter Name=tag:Name,Values=lwjgl-vpc --query Vpcs[].VpcId --output text`
aws --profile lwjgl ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.16.0/20 --ipv6-cidr-block 2600:1f18:14f5:1500::/64 --availability-zone-id use1-az1
aws --profile lwjgl ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.32.0/20 --ipv6-cidr-block 2600:1f18:14f5:1501::/64 --availability-zone-id use1-az2
```

Create an Internet Gateway
Associate `0.0.0.0/0` and `::/0` to IG

## Nameservers

```
lwjgl.org:
ns-362.awsdns-45.com.
ns-1398.awsdns-46.org.
ns-685.awsdns-21.net.
ns-1892.awsdns-44.co.uk.

lwjgl.com
ns-1043.awsdns-02.org.
ns-234.awsdns-29.com.
ns-2016.awsdns-60.co.uk.
ns-784.awsdns-34.net.
```
