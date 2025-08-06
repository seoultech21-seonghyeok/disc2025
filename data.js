var request = require('request');

var client_id = '2kWe63hVRYN4wgzQ2q9y';
var client_secret = 'mpqPsVsW9I';

var api_url = 'https://naveropenapi.apigw.ntruss.com/datalab/v1/search';
var request_body = {
  startDate: '2017-01-01',
  endDate: '2017-04-30',
  timeUnit: 'month',
  keywordGroups: [
    {
      groupName: '한글',
      keywords: ['한글', 'korean'],
    },
    {
      groupName: '영어',
      keywords: ['영어', 'english'],
    },
  ],
  device: 'pc',
  ages: ['1', '2'],
  gender: 'f',
};

request.post(
  {
    url: api_url,
    body: JSON.stringify(request_body),
    headers: {
      'X-NCP-APIGW-API-KEY-ID': client_id,
      'X-NCP-APIGW-API-KEY': client_secret,
      'Content-Type': 'application/json',
    },
  },
  function(error, response, body) {
    console.log(response.statusCode);
    console.log(body);
  },
);
