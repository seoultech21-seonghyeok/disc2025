// Node.js 18+ 버전에서 동작
import fetch from 'node-fetch'; // Node.js 18 이상이면 생략 가능
// 또는: const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const client_id = '2kWe63hVRYN4wgzQ2q9y';
const client_secret = 'mpqPsVsW9I';

const requestBody = {
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

fetch('https://naveropenapi.apigw.ntruss.com/datalab/v1/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-NCP-APIGW-API-KEY-ID': client_id,
    'X-NCP-APIGW-API-KEY': client_secret,
  },
  body: JSON.stringify(requestBody),
})
  .then((res) => res.json())
  .then((data) => {
    console.log('응답 데이터:', data);
    // 필요한 처리
  })
  .catch((err) => {
    console.error('에러:', err);
  });
