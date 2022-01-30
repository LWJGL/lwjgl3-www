import { type Construct } from 'constructs';
import { Stack, type StackProps } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class S3 extends Stack {
  public readonly backup: s3.Bucket;
  public readonly build: s3.Bucket;
  public readonly cdn: s3.Bucket;
  public readonly javadoc: s3.Bucket;
  public readonly legacy: s3.Bucket;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    this.backup = new s3.Bucket(this, 'backup', {
      bucketName: 'lwjgl-backup',
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    this.build = new s3.Bucket(this, 'build', {
      bucketName: 'lwjgl-build',
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      // websiteIndexDocument: 'index.html',
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ['https://www.lwjgl.org'],
          exposedHeaders: [],
        },
        {
          allowedHeaders: ['*'],
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ['http://www.lwjgl.localhost'],
          exposedHeaders: [],
        },
        {
          allowedHeaders: ['Authorization'],
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          exposedHeaders: [],
          maxAge: 3000,
        },
      ],
    });

    this.cdn = new s3.Bucket(this, 'cdn', {
      bucketName: 'lwjgl-cdn',
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      // publicReadAccess: true,
    });

    this.javadoc = new s3.Bucket(this, 'javadoc', {
      bucketName: 'lwjgl-javadoc',
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      // websiteIndexDocument: 'index.html',
      // publicReadAccess: true,
    });

    this.legacy = new s3.Bucket(this, 'legacy', {
      bucketName: 'lwjgl-legacy',
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,
      // websiteIndexDocument: 'index.html',
      // publicReadAccess: true,
    });
  }
}
