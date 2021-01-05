import type { CloudFrontRequestEvent } from 'aws-lambda';

export const cf_event: CloudFrontRequestEvent = {
  Records: [
    {
      cf: {
        config: {
          distributionDomainName: 'www.lwjgl.org',
          distributionId: 'ENXBPW89N98ZQ',
          eventType: 'viewer-request',
          requestId: 'MRVMF7KydIvxMWfJIglgwHQwZsbG2IhRJ07sn9AkKUFSHS9EXAMPLE==',
        },
        request: {
          clientIp: '2001:0db8:85a3:0:0:8a2e:0370:7334',
          querystring: '',
          uri: '/',
          method: 'GET',
          headers: {
            host: [
              {
                key: 'Host',
                value: 'www.lwjgl.org',
              },
            ],
            'user-agent': [
              {
                key: 'User-Agent',
                value:
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
              },
            ],
            accept: [
              {
                key: 'Accept',
                value:
                  'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
              },
            ],
          },
        },
      },
    },
  ],
};
