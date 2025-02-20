# BoRiS

## Environnement technique

Le projet est un monorepo, utilisant le système de [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) de
npm.

- [Svelte](https://svelte.dev/docs/introduction): [version 5](https://svelte-5-preview.vercel.app/docs/introduction)
- [SvelteKit](https://kit.svelte.dev/docs/introduction)
- [NestJS](https://nestjs.com/)
- [Commits conventionnel](https://www.conventionalcommits.org/en/v1.0.0/)

## Installation

1. Cloner le repository

   ```
   git clone git@github.com:MTES-MCT/boris.git
   ```

2. Mettre en place les variables d'environnement

   ```
   cp apps/frontend/.env.example apps/frontend/.env
   ```

   Demander à une personne de l'équipe dev les valeurs des variables d'environnement à saisir dans le fichier `.env`

3. Installer les dépendances

   ```
   npm install
   ```

## Frontend

### Lancer le server de développement

```

npm run dev -w @boris/frontend

```

## Backend

### Lancer le server de développement

```

npm run dev -w apps/backend

```

### Schéma entités/relations

[Schéma entités/relations](/apps/backend/doc/entities-relationships-diagram.mermaid)
