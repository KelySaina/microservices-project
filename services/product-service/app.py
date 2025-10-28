from flask import Flask, request, jsonify
from ariadne import graphql_sync, load_schema_from_path, make_executable_schema
from ariadne.constants import PLAYGROUND_HTML
from schema import schema
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

@app.route("/graphql", methods=["GET"])
def graphql_playground():
    return PLAYGROUND_HTML, 200

@app.route("/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=True
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code

if __name__ == "__main__":
    port = int(os.getenv("PORT", 4002))
    app.run(host="0.0.0.0", port=port)
