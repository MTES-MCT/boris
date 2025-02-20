echo "$APP_NAME: Procfile > web"

if [ "$APP_NAME" = "frontend" ] ; then
  npm run start -w @boris/frontend
elif [ "$APP_NAME" = "backend" ]; then
  npm i --save-dev @types/node
	npm run start -w @boris/backend
fi
