from flask import Flask, request, jsonify
import json

app = Flask(__name__)

with open("conditions.json") as file:
    conditions = json.load(file)


@app.after_request
def allow_access(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


@app.route("/check")
def check():
    symptoms = request.args.get("symptoms", "").lower().split(",")

    results = []

    for condition, condition_symptoms in conditions.items():
        matches = 0

        for symptom in symptoms:
            if symptom.strip() in condition_symptoms:
                matches += 1

        if matches > 0:
            results.append({
                "condition": condition,
                "matches": matches
            })

    results.sort(key=lambda x: x["matches"], reverse=True)

    return jsonify(results)


app.run(port=5000)