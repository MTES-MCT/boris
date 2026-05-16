#!/bin/sh

set -e

ROOT_DIR=$(cd -- "$(dirname -- "$0")" && pwd)

echo "Starting app $APP"

if echo "$APP" | grep -o 'backend'; then
    npm run start:prod -w @boris/backend

elif echo "$APP" | grep -q 'frontend'; then
    npm run start -w @boris/frontend

elif echo "$APP" | grep -q 'ofs-portal'; then
    npm run start -w @boris/ofs-portal
fi