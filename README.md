# BoRiS

## Environnement technique

Le projet est un monorepo, utilisant le système de [workspaces](https://yarnpkg.com/features/workspaces)

- [Svelte](https://svelte.dev/docs/introduction): [version 5](https://svelte-5-preview.vercel.app/docs/introduction)
- [SvelteKit](https://kit.svelte.dev/docs/introduction)
- [Commits conventionnel](https://www.conventionalcommits.org/en/v1.0.0/)
- [Talisman](https://github.com/thoughtworks/talisman)

## Pré-requis

- [Talisman](https://github.com/thoughtworks/talisman) doit être installé localement sur votre machine.

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
   yarn
   ```

## Client

Lancer le server de développement

```
yarn workspace @boris/client dev
```
