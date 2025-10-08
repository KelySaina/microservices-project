from flask import Flask, request, jsonify
from ariadne import QueryType, make_executable_schema, gql, graphql_sync
from ariadne.constants import PLAYGROUND_HTML

app = Flask(__name__)

type_defs = gql("""
    type Query {
        products: [String]
    }
""")

query = QueryType()

@query.field("products")
def resolve_products(*_):
    return ["Laptop", "Phone", "Tablet"]

schema = make_executable_schema(type_defs, query)

# GraphQL Playground
@app.route("/graphql", methods=["GET"])
def graphql_playground():
    return PLAYGROUND_HTML, 200

# GraphQL endpoint
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

# Health check endpoint
@app.route("/healthz", methods=["GET"])
def healthz():
    return "Product Service is healthy!!!", 200

if __name__ == "__main__":
    app.run(port=4003, host="0.0.0.0")
