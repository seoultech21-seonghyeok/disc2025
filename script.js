document.getElementById('searchBtn').addEventListener('click', () => {
  const input = document.getElementById('keywordInput').value.trim();
  if (!input) {
    alert('키워드를 입력하세요 (콤마로 여러 개 구분)');
    return;
  }

  // 입력 키워드를 배열로 변환
  const keywords = input.split(',').map(s => s.trim()).filter(Boolean);
  if (keywords.length === 0) {
    alert('올바른 키워드를 입력하세요.');
    return;
  }

  // 백엔드 API 호출 URL (Render 배포 주소 + /trends?keywords=...)
  const apiUrl = `https://disc2025.onrender.com/trends?keywords=${encodeURIComponent(keywords.join(','))}`;
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert('API 오류: ' + data.error);
        return;
      }
      drawChart(data, keywords);
    })
    .catch(() => {
      alert('데이터를 불러오지 못했습니다');
    });
    console.log('입력 키워드:', input);
    console.log('호출 URL:', apiUrl);

});

function drawChart(data, keywords) {
  // data 구조에 맞게 파싱 (네이버 API 결과 포맷에 따라 조정 필요)
  // 여기서는 간단히 results 배열에서 각 키워드별 data를 찾아 처리

  const results = data.results || [];
  const labels = []; // 시간 (x축)
  const datasets = [];

  // 우선 labels 만들기 (startDate ~ endDate 기간 월 단위 가정)
  if (results.length > 0) {
    // 가장 첫 결과의 data에서 시간 가져오기
    for (const point of results[0].data) {
      labels.push(point.period);
    }
  }

  keywords.forEach((keyword, idx) => {
    // 키워드에 해당하는 결과 객체 찾기 (title 또는 keywords 배열 안에 keyword 포함 여부)
    const group = results.find(g => g.title === keyword || g.keywords.includes(keyword));
    if (!group) return;

    const dataPoints = group.data.map(d => d.ratio);
    datasets.push({
      label: keyword,
      data: dataPoints,
      borderColor: `hsl(${(idx * 70) % 360}, 70%, 50%)`,
      backgroundColor: `hsla(${(idx * 70) % 360}, 70%, 50%, 0.2)`,
      fill: true,
      tension: 0.3,
    });
  });

  // 기존 차트 있으면 지우기
  if (window.trendChartInstance) {
    window.trendChartInstance.destroy();
  }

  const ctx = document.getElementById('trendChart').getContext('2d');
  window.trendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: '키워드별 검색량 변화',
          font: { size: 18 }
        },
        tooltip: { mode: 'index', intersect: false },
        legend: { position: 'top' }
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      scales: {
        x: { title: { display: true, text: '기간' } },
        y: { title: { display: true, text: '검색량' }, beginAtZero: true }
      }
    }
  });
}
