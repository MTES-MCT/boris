<script lang="ts">
  import Section from '$components/common/Section.svelte';

  const verbatims = [
    {
      quote:
        "Nous avons finalement trouvé notre logement à Saint-Ouen sur Seine. Nous sommes ravis de ce choix. Encore merci, tout ça c'est grâce à BoRiS",
      name: 'Marianne',
    },
    {
      quote:
        "Nous avons signé l'acte de vente avant-hier, plus qu'à attendre la livraison ! Merci encore pour votre suivi au début.",
      name: 'Julien',
    },
    {
      quote:
        "Maintenant que je connais le BRS, j'attend la commercialisation de plusieurs projets sur mon territoire de recherche, plus préparée que jamais.",
      name: 'Hawa',
    },
  ];
</script>

<Section>
  <h3 class="text-center">Ils en parlent mieux que nous !</h3>

  <div class="fr-container-fluid">
    <div class="fr-grid-row fr-grid-row--gutters">
      {#each verbatims as { quote, name }}
        {@render verbatim(quote, name)}
      {/each}
    </div>
  </div>
</Section>

{#snippet verbatim(quote: string, name: string)}
  <div class="fr-col-12 fr-col-md-4">
    <div
      class="flex flex-col justify-between h-full rounded-2xl fr-p-5w bg-white">
      <div>
        <span
          class="fr-icon-quote-line fr-icon--lg text-teal-primary bg-teal-light rounded-full fr-p-2w"
          aria-hidden="true">
        </span>
        <p class="fr-mt-4w fr-text--lg fr-text--bold">
          « {quote} »
        </p>
      </div>

      <p class="fr-text--sm fr-text--bold fr-m-0">
        <span
          class="fr-icon-user-line fr-icon--sm fr-pr-1v"
          aria-hidden="true">
        </span>
        {name}
      </p>
    </div>
  </div>
{/snippet}
