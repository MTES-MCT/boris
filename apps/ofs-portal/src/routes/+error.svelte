<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head>
  <title>Erreur {page.status} - Espace OFS - BoRiS</title>
</svelte:head>

<main class="fr-container fr-py-8w">
  <h1 class="fr-h3">Erreur {page.status}</h1>
  <p>{page.error?.message || 'Une erreur est survenue.'}</p>
  <p>
    <a class="fr-link" href={page.error?.backHref || '/connexion'}>Revenir</a>
  </p>
</main>
