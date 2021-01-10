import { CloudFront } from '@aws-sdk/client-cloudfront';

const distributionIds = {
  www: 'ENXBPW89N98ZQ',
  build: 'E23P50F0J5ZE30',
  javadoc: 'E2128JB5XYS0E',
  blog: 'E1S5ZLF6PKR47Q',
};

let distribution = 'www';

process.argv.slice(2).forEach(arg => {
  switch (arg) {
    case 'build':
    case 'javadoc':
    case 'blog':
      distribution = arg;
      break;
  }
});

const cloudfront = new CloudFront({ region: 'us-east-1' });

const output = await cloudfront.createInvalidation({
  DistributionId: distributionIds[distribution],
  InvalidationBatch: {
    CallerReference: Date.now(),
    Paths: {
      Quantity: 1,
      Items: ['/*'],
    },
  },
});

console.log(output.Invalidation);
console.log(output.Location);
