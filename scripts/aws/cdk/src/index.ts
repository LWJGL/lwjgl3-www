#!/usr/bin/env node
import 'source-map-support/register';
import { App, type Environment } from 'aws-cdk-lib';
import { S3 } from './S3';
import { Route53Zones } from './Route53Zones';
import { ECS } from './ECS';
import { Website } from './Website';
import { LoadBalancer } from './LoadBalancer';
import { Cloudfront } from './Cloudfront';
import { Route53Hosts } from './Route53Hosts';

const app = new App();

const env: Environment = {
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
  account: process.env.CDK_DEFAULT_ACCOUNT || '770058214810',
};

const s3 = new S3(app, 'S3', { env });
const route53Zones = new Route53Zones(app, 'DNS', { env });
const ecs = new ECS(app, 'ECS', { env });
const lb = new LoadBalancer(app, 'LoadBalancer', { env, route53Zones });
const website = new Website(app, 'Website', { env, ecs, lb });
const cloudfront = new Cloudfront(app, 'Cloudfront', { env, s3, route53Zones, lb });
const route53Hosts = new Route53Hosts(app, 'Route53Hosts', { env, route53Zones, lb, cloudfront });
