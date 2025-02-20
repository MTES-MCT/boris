echo "$APP_NAME: package.json > scalingo-postbuild"

if [ "$APP_NAME" = "frontend" ] ; then
  npm run build -w @boris/frontend
elif [ "$APP_NAME" = "backend" ] ; then
  npm run build -w @boris/backend
fi
