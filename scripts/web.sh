echo "$APP_NAME: Procfile > web"

if [ "$APP_NAME" = "frontend" ] ; then
  npm run start -w client
elif [ "$APP_NAME" = "backend" ]; then
	npm run start -w apps/backend
fi
