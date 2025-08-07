document.addEventListener('DOMContentLoaded', function () {
    fetch('https://disc2025.onrender.com') // JSON 파일 경로
        .then(response => response.json())
        .then(data => {
            const trends = data.trend;

            // X축: 시간
            const labels = trends.map(item => item.time);

            // Y축: 각 모델별 검색량
            const geminiData = trends.map(item => item.values["Gemini"]);
            const gptData = trends.map(item => item.values["gpt"]);
            const claudeData = trends.map(item => item.values["claude"]);

            // Chart.js 그래프 생성
            const ctx = document.getElementById('trendChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Gemini',
                            data: geminiData,
                            borderColor: 'blue',
                            backgroundColor: 'rgba(0, 0, 255, 0.1)',
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'GPT',
                            data: gptData,
                            borderColor: 'green',
                            backgroundColor: 'rgba(0, 255, 0, 0.1)',
                            fill: true,
                            tension: 0.3
                        },
                        {
                            label: 'Claude',
                            data: claudeData,
                            borderColor: 'orange',
                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                            fill: true,
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: '시간별 검색량 변화',
                            font: {
                                size: 18
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
                        },
                        legend: {
                            position: 'top'
                        }
                    },
                    interaction: {
                        mode: 'nearest',
                        axis: 'x',
                        intersect: false
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: '시간'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '검색량'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(() => {
            document.body.innerHTML = "<p style='text-align:center;color:red;'>[데이터를 불러오지 못했습니다]</p>";
        });
});
