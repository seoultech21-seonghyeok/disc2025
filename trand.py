from pytrends.request import TrendReq
import json
from datetime import datetime

# pytrends 설정
pytrends = TrendReq(hl='ko', tz=540)

# 분석할 키워드 리스트
keywords = ["Gemini", "gpt", "claude"]

# 최근 1시간 데이터 요청 (1분 간격 데이터 제공)
pytrends.build_payload(kw_list=keywords, timeframe='now 1-H', geo='KR')

# 데이터 가져오기
data = pytrends.interest_over_time()
data = data.drop(columns=['isPartial'])  # 불필요한 컬럼 제거

# JSON 변환
trend_data = []
for index, row in data.iterrows():
    timestamp = index.strftime('%Y-%m-%d %H:%M:%S')
    trend_data.append({
        "time": timestamp,
        "values": row.to_dict()
    })

# 파일로 저장
with open('trend_hour.json', 'w', encoding='utf-8') as f:
    json.dump({"trend": trend_data}, f, ensure_ascii=False, indent=4)

print("✅ 최근 1시간 트렌드 변화 데이터 저장 완료 → trend_hour.json")
