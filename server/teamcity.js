import request from 'request'

const config = require('../config.json');

export default (req, res, next) => {
  request(
    {
      method: 'GET',
      baseUrl: 'http://teamcity.lwjgl.org',
      url: '/httpAuth/app/rest/builds/',
      qs: {
        locator: `running:false,count:1,buildType:${req.query.build}`
      },
      headers: {
        'Accept': 'application/json'
      },
      auth: {
        'user': config.teamcity.username,
        'pass': config.teamcity.password
      },
      gzip: true,
      followRedirect: false,
      timeout: 5000
    },
    (error, response, data) => {
      if ( error ) {
        res.status(500).json({error: error.message});
        return;
      }

      if ( response.statusCode !== 200 ) {
        res.status(response.statusCode).json({error: 'Invalid response'});
        return;
      }

      res.json(JSON.parse(data));
    }
  );
}
