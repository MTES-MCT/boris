# BoRiS

## Environnement technique

Le projet est un monorepo, utilisant le système de [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) de
npm.

- [Svelte](https://svelte.dev/docs/introduction): [version 5](https://svelte-5-preview.vercel.app/docs/introduction)
- [SvelteKit](https://kit.svelte.dev/docs/introduction)
- [Commits conventionnel](https://www.conventionalcommits.org/en/v1.0.0/)

## Installation

1. Cloner le repository

   ```
   git clone git@github.com:MTES-MCT/boris.git
   ```

2. Mettre en place les variables d'environnement

   ```
   cp client/.env.example client/.env
   ```

   Demander à une personne de l'équipe dev les valeurs des variables d'environnement à saisir dans le fichier `.env`

3. Installer les dépendances

   ```
   npm install
   ```

## Client

Lancer le server de développement

```

npm run dev -w client

```
