// Render에서 배포된 FastAPI URL을 아래에 입력하세요
const API_URL = "https://disc2025.onrender.com/";

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    console.log("받은 데이터:", data);
  })
  .catch(error => {
    console.error("에러 발생:", error);
  });
