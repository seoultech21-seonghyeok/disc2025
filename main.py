from flask import Flask, request, jsonify
import os
import requests

app = Flask(__name__)

NAVER_CLIENT_ID = os.environ.get("NAVER_CLIENT_ID")
NAVER_CLIENT_SECRET = os.environ.get("NAVER_CLIENT_SECRET")

@app.route("/api/naver-search", methods=["POST"])
def naver_search():
    data = request.json

    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        "Content-Type": "application/json"
    }

    response = requests.post(
        "https://openapi.naver.com/v1/datalab/search",
        headers=headers,
        json=data
    )

    return jsonify(response.json())

@app.route("/")
def home():
    return "Hello from Render Flask API!"

if __name__ == "__main__":
    # Render는 기본적으로 PORT 환경변수로 포트를 줍니다.
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
