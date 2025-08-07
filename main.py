from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import urllib.request
from datetime import datetime, timedelta
app = Flask(__name__)
CORS(app)

CLIENT_ID = os.environ.get("NAVER_CLIENT_ID")
CLIENT_SECRET = os.environ.get("NAVER_CLIENT_SECRET")

@app.route("/trends")
def get_trends():
    keywords_param = request.args.get("keywords")
    if not keywords_param:
        return jsonify({"error": "keywords 파라미터가 필요합니다."}), 400

    keywords = [k.strip() for k in keywords_param.split(",") if k.strip()]
    if not keywords:
        return jsonify({"error": "키워드를 올바르게 입력하세요."}), 400

    keyword_groups = [{
        "groupName": f"Group{i+1}",
        "keywords": keywords[i*20:(i+1)*20]  # 최대 20개씩 그룹화
    } for i in range((len(keywords)+19)//20)]

    today = datetime.today()
    start_date = (today - timedelta(days=30)).strftime("%Y-%m-%d")  # 30일 전
    end_date = today.strftime("%Y-%m-%d")  # 오늘

    body = {
        "startDate": start_date,
        "endDate": end_date,
        "timeUnit": "date",
        "keywordGroups": keyword_groups,
        "device": "pc",
        # "gender": "f",  # 필요시 추가 가능
        # "ages": ["1", "2"],  # 필요시 추가 가능
    }

    url = "https://openapi.naver.com/v1/datalab/search"
    headers = {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
        "Content-Type": "application/json"
    }

    req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), headers=headers)
    try:
        response = urllib.request.urlopen(req)
        result = response.read().decode('utf-8')
        return jsonify(json.loads(result))
    except urllib.error.HTTPError as e:
        return jsonify({"error": e.reason, "code": e.code})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))