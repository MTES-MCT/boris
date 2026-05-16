#!/bin/sh

set -e

echo "Building app for $APP"

if echo "$APP" | grep -o 'backend'; then
    npm run build -w @boris/backend
    echo "Running migrate for $APP"
    npm run migration:migrate -w @boris/backend

elif echo "$APP" | grep -q 'frontend'; then
    npm run build -w @boris/frontend

elif echo "$APP" | grep -q 'ofs-portal'; then
    npm run build -w @boris/ofs-portal
fi