<script lang="ts">
  import Section from '$components/common/Section.svelte';
</script>

<svelte:head>
  <title>Page introuvable - BoRiS</title>
</svelte:head>

<Section
  title="Oups..."
  titleElement="h1">
  <p>La page que vous cherchez n'existe pas.</p>
  <a
    class="fr-btn fr-btn--lg"
    href="/">
    Retour à la page d'accueil
  </a>
</Section>
