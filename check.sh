while true; do
  echo "Request at $(date):"
  curl -s -X POST http://myapp.local:30080/auth \
       -H "Content-Type: application/json" \
       -d '{"query":"{ hello }"}'
  echo -e "\n---------------------------\n"
  sleep 5
done
