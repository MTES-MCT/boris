<script lang="ts">
  let { data } = $props();
  type SelectionItem = NonNullable<typeof data.ofss>[number];

  let search = $state("");
  const showSearch = $derived((data.ofss?.length || 0) > 5);
  const filtered = $derived(
    (data.ofss || []).filter((ofs: SelectionItem) =>
      ofs.name
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .includes(
          search
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .toLowerCase(),
        ),
    ),
  );
</script>

<svelte:head>
  <title>Sélectionner un OFS - Espace OFS - BoRiS</title>
</svelte:head>

<h1 class="fr-h3">Sélectionner un OFS</h1>
<p class="fr-text--sm">Sélectionnez l’OFS que vous souhaitez consulter.</p>

{#if showSearch}
  <div class="fr-input-group fr-mt-3w">
    <label class="fr-label" for="ofs-search">Rechercher un OFS</label>
    <input class="fr-input" id="ofs-search" type="search" bind:value={search} />
  </div>
{/if}

<div class="fr-grid-row fr-grid-row--gutters fr-mt-3w">
  {#if filtered.length === 0}
    <div class="fr-col-12">
      <div class="fr-alert fr-alert--info">
        <p>Aucun OFS ne correspond à votre recherche.</p>
      </div>
    </div>
  {/if}
  {#each filtered as ofs}
    <div class="fr-col-12 fr-col-md-6">
      <a
        class="fr-card fr-enlarge-link fr-card--no-arrow"
        href={`/ofs/${ofs.id}`}
      >
        <div class="fr-card__body">
          <div class="fr-card__content">
            <h2 class="fr-card__title">{ofs.name}</h2>
            {#if ofs.email}
              <p class="fr-card__desc">{ofs.email}</p>
            {/if}
            {#if ofs.regions?.length || ofs.departements?.length}
              <p class="fr-card__desc">
                {#if ofs.regions?.length}{ofs.regions.join(", ")}{/if}
                {#if ofs.regions?.length && ofs.departements?.length}
                  ·
                {/if}
                {#if ofs.departements?.length}{ofs.departements.join(", ")}{/if}
              </p>
            {/if}
          </div>
        </div>
      </a>
    </div>
  {/each}
</div>
