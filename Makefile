DOCKER_COMPOSE = docker-compose

docker-start:
	${DOCKER_COMPOSE} up -d

docker-stop:
	${DOCKER_COMPOSE} stop

psql:
	docker exec -it boris-database_dev-1 psql -U boris -d boris

psql-test:
	docker exec -it boris-database_test-1 psql -U boris -d boris-test

migration-generate:
	npm run migration:generate src/infrastructure/persistence/migrations/${NAME} -w @boris/backend

migration-migrate:
	npm run migration:migrate -w @boris/backend
	npm run migration:migrate:test -w @boris/backend
