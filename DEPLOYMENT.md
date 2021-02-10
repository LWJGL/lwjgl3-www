# Deployment in Production - Guide

The website is served via [Amazon CloudFront](https://aws.amazon.com/cloudfront/).
Origin is an [ALB](https://aws.amazon.com/elasticloadbalancing/) which targets a container running on [AWS ECS](https://aws.amazon.com/ecs/). DNS is handled by [Route53](https://aws.amazon.com/route53/).

SSL Termination happens on the CDN (using a certificate issued by [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/)). Asset gzip/brotli compression is also handled by the CDN.

The production process involves the following steps:

- Push latest changes on GitHub
- A GitHub Action ([docker-publish.yml](./github/workflows/docker-publish.yml)) is launched, the workflow involves the following steps:
  - Compilation & minification for global CSS
  - Compilation & bundling of JS via [webpack](https://webpack.js.org/)
  - Post-processing of webpack manifest. Processing consists of the following steps:
    - Read the webpack manifest and compile list of files & routes
    - Process each file with terser
    - Compute hashes of final files
    - Store each production file on disk
    - Generate production manifest
    - Generate & print file size report
  - Generated files are deployed to S3
  - The LWJGL server Docker image is created
  - The Docker image is uploaded to GitHub Packages
- The container is launched/updated manually

## Official Docker image

```shell
# requires logging in with Github credentials
docker pull docker.pkg.github.com/lwjgl/lwjgl3-www/lwjgl-website
# to inspect the image run
docker run -it --rm docker.pkg.github.com/lwjgl/lwjgl3-www/lwjgl-website sh
```

## Test production build locally

```shell
git pull
npm i
npm run release
# to launch use:
npm run test-production
```

## Build Docker image locally

```shell
git pull
npm i
npm run release
docker build --rm -t lwjgl/website:latest .
# To test the production docker image:
docker-compose up
```

In order to access AWS resources in development, you'll need to create
a `docker-compose.override.yml` file and populate it with the following configuration:

```yml
version: '3.7'

services:
  lwjgl:
    environment:
      - AWS_ACCESS_KEY_ID=XXXXX
      - AWS_SECRET_ACCESS_KEY=XXXXX
```

## Deploy on ECS

```bash
./aws/update.sh
# after rollout has completed, run
./aws/invalidate.sh
```
