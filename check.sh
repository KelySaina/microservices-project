while true; do
  echo "=== Health Check at $(date) ==="

  echo "[Auth Service]"
  curl -s -o - -w "\nHTTP Status: %{http_code}\n" http://myapp.local:30080/auth/healthz
  echo "---------------------------"

  echo "[Product Service]"
  curl -s -o - -w "\nHTTP Status: %{http_code}\n" http://myapp.local:30080/products/healthz
  echo "---------------------------"

  echo "[Order Service]"
  curl -s -o - -w "\nHTTP Status: %{http_code}\n" http://myapp.local:30080/orders/healthz
  echo "===========================\n"

  sleep 5
done
