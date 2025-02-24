DOCKER_COMPOSE = docker-compose

docker-start:
	${DOCKER_COMPOSE} up -d

docker-stop:
	${DOCKER_COMPOSE} stop

psql:
	docker exec -it boris-database psql -U boris -d boris

migration-generate:
	npm run migration:generate src/infrastructure/persistence/migrations/${NAME} -w @boris/backend

migration-migrate:
	npm run migration:migrate -w @boris/backend
