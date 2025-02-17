source scripts/.env

curl -H "Accept: application/json" -H "Content-Type: application/json" \
    -u ":$SCALINGO_API_TOKEN" \
    -X POST https://auth.scalingo.com/v1/tokens/exchange
