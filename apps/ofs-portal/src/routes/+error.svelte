<script lang="ts">
  let { error, status } = $props();
</script>

<svelte:head>
  <title>Page non trouvée - Espace OFS - BoRiS</title>
</svelte:head>

<main class="fr-container fr-py-8w">
  <h1 class="fr-h3">Page non trouvée</h1>
  <p>{error?.message || `Erreur ${status}`}</p>
  <p>
    <a class="fr-link" href={error?.backHref || '/connexion'}>Revenir</a>
  </p>
</main>
