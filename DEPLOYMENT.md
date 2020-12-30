# Deployment in Production - Guide

The website is served via Amazon CloudFront using the server's hostname & port as origin.
SSL Termination happens on the CDN (using a certificate issued by AWS Certificate Manager).

The production process involves the following steps:

- Compile JS files and store manifest on disk with `npm run release`. Processing consists of the following steps:
  - Read the webpack manifest and compile list of files & routes
  - Process each file with terser
  - Compute hashes of final files
  - Store each production file on disk
  - Generate production manifest that also needs to be shipped
  - Generate & print file size report
- Deploy files to S3 with `npm run deploy`
- `git push` latest changes
- A Github workflow [docker-publish.yml](./github/workflows/docker-publish.yml) automatically runs and prepares the docker image
- The container is launched/updated manually (currently on AWS. Stack consists of ECS, ALB, Cloudfront, and Route53)

## Docker image

```shell
# requires logging in with Github credentials
docker pull docker.pkg.github.com/lwjgl/lwjgl3-www/lwjgl-website
# to inspect the image run
docker run -it --rm docker.pkg.github.com/lwjgl/lwjgl3-www/lwjgl-website sh
```

## Build for production

```shell
git pull
npm i
npm run release
npm run deploy # requires AWS credentials
```

## Docker

To build the production docker image:

```shell
docker build --rm -t lwjgl/website:latest .
```

To test the production docker image (after running release):

```shell
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
