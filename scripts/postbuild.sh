echo "$APP_NAME: package.json > scalingo-postbuild"

if [ "$APP_NAME" = "frontend" ] ; then
  npm run build -w @boris/client
elif [ "$APP_NAME" = "backend" ] ; then
  npm i -g @nestjs/cli
  npm run build -w @boris/backend
fi
