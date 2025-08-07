DOCKER_COMPOSE = docker-compose

docker-start:
	${DOCKER_COMPOSE} up -d

docker-stop:
	${DOCKER_COMPOSE} stop

psql:
	docker exec -it boris-database_dev-1 psql -U boris -d boris

psql-test:
	docker exec -it boris-database_test-1 psql -U boris -d boris-test

psql-staging:
	scalingo -a boris-backend-staging pgsql-console

psql-prod:
	scalingo -a boris-backend-prod pgsql-console

migration-create:
	npm run migration:create src/infrastructure/persistence/migrations/${NAME} -w @boris/backend

migration-generate:
	npm run build -w @boris/backend
	npm run migration:generate src/infrastructure/persistence/migrations/${NAME} -w @boris/backend

migration-migrate:
	npm run build -w @boris/backend
	npm run migration:migrate -w @boris/backend
	npm run migration:migrate:test -w @boris/backend

migration-migrate-ci:
	npm run build -w @boris/backend
	npm run migration:migrate:test -w @boris/backend

migration-revert:
	npm run build -w @boris/backend
	npm run migration:migrate:revert -w @boris/backend
	npm run migration:migrate:revert:test -w @boris/backend

seed:
	npm run seed:regions-departements -w @boris/backend
	npm run seed:ofs -w @boris/backend
	npm run seed:user -w @boris/backend
	npm run seed:brs-diffusion-website -w @boris/backend

seed-test-data:
	npm run seed:test-data -w @boris/backend
