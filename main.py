from flask import Flask, request, jsonify
import os, json, urllib.request
from flask_cors import CORS

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

    # 네이버 API에 맞게 keywordGroups 생성 (한 그룹에 최대 5개 키워드 가능)
    keyword_groups = [{
        "groupName": f"Group{i+1}",
        "keywords": keywords[i*5:(i+1)*5]
    } for i in range((len(keywords)+4)//5)]

    body = {
        "startDate": "2024-06-01",
        "endDate": "2024-08-31",
        "timeUnit": "month",
        "keywordGroups": keyword_groups,
        "device": "pc",
        "ages": ["1", "2"],
        "gender": "f"
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
        result_text = response.read().decode("utf-8")
        data = json.loads(result_text)
        return jsonify(data)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return jsonify({"error": e.reason, "code": e.code, "details": error_body})
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
