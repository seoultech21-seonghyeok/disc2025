import os
import json
import urllib.request
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 환경변수에서 client_id, client_secret 불러오기 (대문자로 통일)
CLIENT_ID = os.environ.get("NAVER_CLIENT_ID")
CLIENT_SECRET = os.environ.get("NAVER_CLIENT_SECRET")

@app.route("/")
def home():
    return "Naver Trend API 연결 테스트"

@app.route("/trends")
def get_trends():
    url = "https://openapi.naver.com/v1/datalab/search"
    headers = {
        "X-Naver-Client-Id": CLIENT_ID,
        "X-Naver-Client-Secret": CLIENT_SECRET,
        "Content-Type": "application/json"
    }
    body = {
        "startDate": "2024-06-01",
        "endDate": "2024-08-01",
        "timeUnit": "month",
        "keywordGroups": [
            {"groupName": "한글", "keywords": ["한글", "korean"]},
            {"groupName": "영어", "keywords": ["영어", "english"]}
        ],
        "device": "pc",
        "ages": ["1", "2"],
        "gender": "f"
    }

    req = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), headers=headers)

    try:
        response = urllib.request.urlopen(req)
        result_text = response.read().decode('utf-8')
        # JSON 파싱 시도
        try:
            data = json.loads(result_text)
            return jsonify(data)
        except json.JSONDecodeError:
            # JSON이 아니면 에러 메시지로 반환
            return jsonify({"error": "Response is not JSON", "content": result_text})

    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return jsonify({"error": e.reason, "code": e.code, "details": error_body})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
