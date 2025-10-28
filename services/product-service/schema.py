from ariadne import QueryType, MutationType, make_executable_schema, gql
from db import get_connection

type_defs = gql("""
type Product {
  id: ID!
  name: String!
  description: String
  price: Float!
  stock: Int!
}

type Query {
  products: [Product!]!
  product(id: ID!): Product
  healthz: String!
}

type Mutation {
  addProduct(name: String!, description: String, price: Float!, stock: Int): Product
  updateStock(id: ID!, stock: Int!): Product
}
""")

query = QueryType()
mutation = MutationType()

# --- Queries ---
@query.field("products")
def resolve_products(*_):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

@query.field("product")
def resolve_product(*_, id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM products WHERE id=%s", (id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row

@query.field("healthz")
def resolve_healthz(*_):
    return "Product Service is healthy"

# --- Mutations ---
@mutation.field("addProduct")
def resolve_add_product(*_, name, description=None, price=0.0, stock=0):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO products (name, description, price, stock) VALUES (%s, %s, %s, %s)",
        (name, description, price, stock)
    )
    conn.commit()
    product_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {
        "id": product_id,
        "name": name,
        "description": description,
        "price": price,
        "stock": stock
    }

@mutation.field("updateStock")
def resolve_update_stock(*_, id, stock):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE products SET stock=%s WHERE id=%s", (stock, id))
    conn.commit()
    cursor.execute("SELECT * FROM products WHERE id=%s", (id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    if row:
        return {
            "id": row[0],
            "name": row[1],
            "description": row[2],
            "price": float(row[3]),
            "stock": row[4]
        }
    return None

schema = make_executable_schema(type_defs, query, mutation)
