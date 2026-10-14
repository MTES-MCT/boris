<script lang="ts">
  let { data } = $props();
  const hasFilters = $derived(
    Boolean(
      data.filters.zipcode || data.filters.city || data.filters.distributor,
    ),
  );
</script>

<svelte:head
  ><title>{data.ofs.name} - Programmes - Espace OFS - BoRiS</title></svelte:head
>

<div class="programs-heading fr-mb-3w">
  <div>
    <h1 class="fr-h3 fr-mb-1w">Programmes</h1>
    <p class="fr-text--sm fr-mb-0">
      Gérez les programmes de {data.ofs.name} affichés sur la carte publique.
    </p>
  </div>
  <a
    class="fr-btn fr-icon-add-line fr-btn--icon-left"
    href={`/ofs/${data.ofs.id}/programmes/nouveau`}>Ajouter un programme</a
  >
</div>

<form
  method="GET"
  class="program-filters fr-mb-3w"
  role="search"
  aria-label="Filtrer les programmes"
>
  <div class="fr-input-group">
    <label class="fr-label" for="program-zipcode">Code postal</label>
    <input
      class="fr-input"
      id="program-zipcode"
      name="zipcode"
      type="search"
      inputmode="numeric"
      value={data.filters.zipcode}
    />
  </div>
  <div class="fr-input-group">
    <label class="fr-label" for="program-city">Ville</label>
    <input
      class="fr-input"
      id="program-city"
      name="city"
      type="search"
      value={data.filters.city}
    />
  </div>
  <div class="fr-input-group">
    <label class="fr-label" for="program-distributor">Commercialisateur</label>
    <input
      class="fr-input"
      id="program-distributor"
      name="distributor"
      type="search"
      value={data.filters.distributor}
    />
  </div>
  <div class="program-filter-actions">
    <button class="fr-btn" type="submit">Filtrer</button>
    {#if hasFilters}
      <a class="fr-btn fr-btn--tertiary" href={`/ofs/${data.ofs.id}/programmes`}
        >Effacer les filtres</a
      >
    {/if}
  </div>
</form>

<p class="fr-text--sm" role="status">
  {data.programs.length} programme(s) affiché(s) sur {data.totalPrograms}.
</p>

{#if data.programs.length}
  <div class="fr-table fr-table--no-caption fr-table--layout-fixed">
    <div class="fr-table__wrapper">
      <div class="fr-table__container">
        <div class="fr-table__content">
          <table>
            <caption>Programmes de {data.ofs.name}</caption>
            <thead
              ><tr
                ><th scope="col">Programme</th><th scope="col">Adresse</th><th
                  scope="col">Commercialisateur</th
                ><th scope="col">Actions</th></tr
              ></thead
            >
            <tbody>
              {#each data.programs as program (program.id)}
                <tr>
                  <td>
                    <strong
                      >{program.programName || "Programme sans nom"}</strong
                    >
                    <p class="fr-text--sm fr-mb-0">
                      {program.housingType === "old" ? "Ancien" : "Neuf"}
                    </p>
                    <a
                      class="fr-link fr-link--sm"
                      href={program.source}
                      target="_blank"
                      rel="noopener noreferrer">Voir l’annonce</a
                    >
                  </td>
                  <td
                    >{program.address}<br />{program.zipcode} {program.city}</td
                  >
                  <td>{program.distributor?.name || "Non renseigné"}</td>
                  <td>
                    <ul class="fr-btns-group fr-btns-group--sm">
                      <li>
                        <a
                          class="fr-btn fr-btn--secondary"
                          href={`/ofs/${data.ofs.id}/programmes/${program.id}/modifier`}
                          aria-label={`Modifier ${program.programName || "le programme"}`}
                          >Modifier</a
                        >
                      </li>
                      <li>
                        <a
                          class="fr-btn fr-btn--tertiary"
                          href={`/ofs/${data.ofs.id}/programmes/${program.id}/supprimer`}
                          aria-label={`Supprimer ${program.programName || "le programme"}`}
                          >Supprimer</a
                        >
                      </li>
                    </ul>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
{:else if hasFilters}
  <section class="fr-p-4w empty-programs">
    <h2 class="fr-h5">Aucun programme ne correspond à vos filtres</h2>
    <p class="fr-mb-0">
      Modifiez ou effacez les filtres pour afficher d’autres programmes.
    </p>
  </section>
{:else}
  <section class="fr-p-4w empty-programs">
    <h2 class="fr-h5">Aucun programme pour le moment</h2>
    <p class="fr-mb-0">
      Ajoutez votre premier programme pour le faire apparaître sur la carte.
    </p>
  </section>
{/if}

<style>
  .programs-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .empty-programs {
    background: white;
    border-radius: 0.5rem;
  }
  .program-filters {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .program-filters .fr-input-group {
    flex: 1 1 12rem;
    margin-bottom: 0;
  }
  .program-filter-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  td {
    overflow-wrap: anywhere;
  }
</style>
