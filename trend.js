document.addEventListener('DOMContentLoaded', function() {
    fetch('trend_hour.json') // JSON 파일 경로
        .then(response => response.json())
        .then(data => {
            const trends = data.trend;

            // 표 시작
            let tableHTML = `
                <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; text-align: center;">
                    <thead>
                        <tr>
                            <th>시간</th>
                            <th>Gemini</th>
                            <th>GPT</th>
                            <th>Claude</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

            // 데이터 행 생성
            trends.forEach(item => {
                tableHTML += `
                    <tr>
                        <td>${item.time}</td>
                        <td>${item.values["Gemini"]}</td>
                        <td>${item.values["gpt"]}</td>
                        <td>${item.values["claude"]}</td>
                    </tr>
                `;
            });

            // 표 닫기
            tableHTML += `
                    </tbody>
                </table>
            `;

            document.getElementById('trend-data').innerHTML = tableHTML;
        })
        .catch(() => {
            document.getElementById('trend-data').innerHTML = "[데이터를 불러오지 못했습니다]";
        });
});
