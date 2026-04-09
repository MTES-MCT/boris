# BoRiS

## Environnement technique

Le projet est un monorepo, utilisant le système de [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) de
npm.

- Frontend: [Svelte](https://svelte.dev/docs) et [SvelteKit](https://kit.svelte.dev/docs/introduction)
- Backend: [NestJS](https://nestjs.com/)
- Système de gestion de base de données: [PostgreSQL](https://www.postgresql.org/)
- Déploiement: [Scalingo](https://doc.scalingo.com/)
- Monitoring: [Sentry](https://docs.sentry.io/)

## Installation

1. Cloner le repository

   ```
   git clone git@github.com:MTES-MCT/boris.git
   ```

2. Mettre en place les variables d'environnement

   ```
   cp apps/frontend/.env.example apps/frontend/.env
   cp apps/backend/.env.example apps/backend/.env
   ```

   Demander à une personne de l'équipe dev les valeurs des variables d'environnement à saisir dans le fichier `.env`

3. Utiliser la version de node du projet

   ```
   nvm use
   ```

4. Installer les dépendances

   ```
   npm install
   ```

## Docker

La base de données locale PostgreSQL se trouve dans un container docker.

### Lancer le container de la base de données

```
make docker-start
```

### Arrêter le container de la base de données

```
make docker-stop
```

### Accéder au container de la base de données en ligne de commande

```
make psql
```

## Backend

### Exécuter les migration de la bases de données

```
make migration-migrate
```

### Lancer le server de développement

```

npm run start -w apps/backend

```

### Générer une migration

```
make migration-generate NAME=nom_de_la_migration
```

### Exécuter un seed sur une instance Scalingo

```
# Connexion à l'instance
scalingo --app app-name run bash

# Installation de ts-node
npm install ts-node

# Exécution du seed
npm run seed:seed-name
```

### Schéma entités/relations

[Schéma entités/relations](/apps/backend/doc/entities-relationships-diagram.mermaid)

## Frontend

### Lancer le server de développement

```
npm run dev -w @boris/frontend

```

## Pistes d'améliorations globales

- Création d'un workspace pour des composants partagées, en vue des différentes interfaces Svelte qui vont être développées
- Basculer le déploiement Scalingo sur la CI/CD github, notamment le build de l'app et les migrations de bases de données
- Optimisation/mutualisation des tests e2e coté front, notament ceux du simulateur d'éligibilité
