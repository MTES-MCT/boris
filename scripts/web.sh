echo "$APP_NAME: Procfile > web"

if [ "$APP_NAME" = "frontend" ] ; then
  npm run start -w client
fi
