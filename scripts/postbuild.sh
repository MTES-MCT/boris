echo "$APP_NAME: package.json > scalingo-postbuild"

if [ "$APP_NAME" = "frontend" ] ; then
  npm run build -w client
fi
