<script lang="ts">
  let { data, form } = $props();
  let createScopeType = $state<"ALL" | "GEOGRAPHIC">("ALL");
  let editScopeTypeById = $state<Record<string, "ALL" | "GEOGRAPHIC">>({});

  const availableDistributors = $derived(
    data.distributors.filter(
      (distributor) =>
        !data.transmissions.some(
          (transmission) => transmission.distributor.id === distributor.id,
        ),
    ),
  );

  $effect(() => {
    editScopeTypeById = Object.fromEntries(
      data.transmissions.map((transmission) => [
        transmission.id,
        transmission.scopeType,
      ]),
    );
  });

  function codes(values: string[]) {
    return values.join(", ");
  }
</script>

<svelte:head>
  <title>{data.ofs.name} - Transmissions - Espace OFS - BoRiS</title>
</svelte:head>

<div class="fr-grid-row fr-grid-row--gutters">
  <div class="fr-col-12 fr-col-lg-7">
    <h1 class="fr-h3">Transmissions commerciales</h1>
    <p class="fr-text--sm">
      Configurez les contacts transmis aux commercialisateurs pour cet OFS.
    </p>
  </div>
</div>

{#if form?.error}
  <div class="fr-alert fr-alert--error fr-mb-3w"><p>{form.error}</p></div>
{/if}

<section class="fr-p-3w fr-mb-4w" style="background: white; border-radius: 0.5rem;">
  <h2 class="fr-h5">Nouvelle transmission</h2>
  {#if availableDistributors.length}
    <form method="POST" action="?/create">
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <label class="fr-label" for="distributorId">Commercialisateur</label>
          <select class="fr-select" id="distributorId" name="distributorId" required>
            <option value="">Sélectionner</option>
            {#each availableDistributors as distributor}
              <option value={distributor.id}>{distributor.name}</option>
            {/each}
          </select>
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <label class="fr-label" for="scopeType">Périmètre</label>
          <select
            class="fr-select"
            id="scopeType"
            name="scopeType"
            bind:value={createScopeType}
          >
            <option value="ALL">Tous les contacts visibles par l'OFS</option>
            <option value="GEOGRAPHIC">Codes INSEE ou départements</option>
          </select>
        </div>
      </div>

      {#if createScopeType === "GEOGRAPHIC"}
        <div class="transmission-scope fr-mt-2w">
          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-12 fr-col-md-6">
              <label class="fr-label" for="inseeCodes">Codes communes INSEE</label>
              <input
                class="fr-input"
                id="inseeCodes"
                name="inseeCodes"
                placeholder="75056, 69123"
              />
            </div>
            <div class="fr-col-12 fr-col-md-6">
              <label class="fr-label" for="departementCodes">Codes départements</label>
              <input
                class="fr-input"
                id="departementCodes"
                name="departementCodes"
                placeholder="75, 69"
              />
            </div>
          </div>
        </div>
      {/if}

      <div class="fr-checkbox-group fr-mt-2w">
        <input id="isActive" name="isActive" type="checkbox" checked />
        <label class="fr-label" for="isActive">Active</label>
      </div>
      <button class="fr-btn fr-mt-3w" type="submit">Créer</button>
    </form>
  {:else}
    <p class="fr-text--sm">
      Tous les commercialisateurs rattachés à cet OFS ont déjà une transmission,
      ou aucun commercialisateur n'est encore rattaché à cet OFS.
    </p>
  {/if}
</section>

{#if data.transmissions.length}
  <div class="transmissions-list">
    <h2 class="fr-h5">{data.transmissions.length} transmission(s) configurée(s)</h2>

    {#each data.transmissions as transmission}
      <section class="transmission-panel">
        <div class="transmission-panel__header">
          <div>
            <h3 class="fr-h6 fr-mb-1v">{transmission.distributor.name}</h3>
            <p class="fr-text--sm fr-mb-0">
              {#if transmission.scopeType === "ALL"}
                Périmètre actuel : tous les contacts visibles par l'OFS
              {:else}
                Périmètre actuel : INSEE {codes(transmission.inseeCodes) || "-"}
                · départements {codes(transmission.departementCodes) || "-"}
              {/if}
            </p>
          </div>
          <span
            class={`fr-badge ${transmission.isActive ? "fr-badge--success" : "fr-badge--warning"}`}
          >
            {transmission.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <form method="POST" action="?/update" class="transmission-form">
          <input type="hidden" name="transmissionId" value={transmission.id} />

          <div class="fr-grid-row fr-grid-row--gutters">
            <div class="fr-col-12 fr-col-lg-4">
              <label class="fr-label" for={`scopeType-${transmission.id}`}>
                Périmètre de transmission
              </label>
              <select
                class="fr-select"
                id={`scopeType-${transmission.id}`}
                name="scopeType"
                bind:value={editScopeTypeById[transmission.id]}
              >
                <option value="ALL">Tous les contacts visibles</option>
                <option value="GEOGRAPHIC">Codes INSEE ou départements</option>
              </select>
            </div>

            <div class="fr-col-12 fr-col-lg-3">
              <div class="transmission-status">
                <p class="fr-label fr-mb-1w">Statut de la transmission</p>
                <div class="fr-checkbox-group fr-mb-0">
                  <input
                    id={`isActive-${transmission.id}`}
                    name="isActive"
                    type="checkbox"
                    checked={transmission.isActive}
                  />
                  <label class="fr-label" for={`isActive-${transmission.id}`}>
                    Active
                  </label>
                </div>
              </div>
            </div>
          </div>

          {#if editScopeTypeById[transmission.id] === "GEOGRAPHIC"}
            <div class="transmission-scope fr-mt-2w">
              <div class="fr-grid-row fr-grid-row--gutters">
                <div class="fr-col-12 fr-col-md-6">
                  <label class="fr-label" for={`inseeCodes-${transmission.id}`}>
                    Codes communes INSEE transmis
                  </label>
                  <input
                    class="fr-input"
                    id={`inseeCodes-${transmission.id}`}
                    name="inseeCodes"
                    value={codes(transmission.inseeCodes)}
                    placeholder="75056, 69123"
                  />
                </div>
                <div class="fr-col-12 fr-col-md-6">
                  <label class="fr-label" for={`departementCodes-${transmission.id}`}>
                    Codes départements transmis
                  </label>
                  <input
                    class="fr-input"
                    id={`departementCodes-${transmission.id}`}
                    name="departementCodes"
                    value={codes(transmission.departementCodes)}
                    placeholder="75, 69"
                  />
                </div>
              </div>
            </div>
          {/if}

          <div class="transmission-panel__actions">
            <button class="fr-btn fr-btn--secondary" type="submit">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </section>
    {/each}
  </div>
{:else}
  <div class="fr-alert fr-alert--info"><p>Aucune transmission commerciale configurée.</p></div>
{/if}

<style>
  .transmissions-list {
    display: grid;
    gap: 1rem;
  }

  .transmission-panel {
    background: white;
    border: 1px solid var(--border-default-grey);
    border-radius: 0.5rem;
    padding: 1.5rem;
  }

  .transmission-panel__header {
    align-items: flex-start;
    border-bottom: 1px solid var(--border-default-grey);
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .transmission-form {
    width: 100%;
  }

  .transmission-scope {
    background: var(--background-alt-grey);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .transmission-status {
    min-height: 100%;
  }

  .transmission-panel__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  @media (max-width: 48em) {
    .transmission-panel__header {
      display: block;
    }

    .transmission-panel__header .fr-badge {
      margin-top: 0.75rem;
    }

    .transmission-panel__actions {
      justify-content: flex-start;
    }
  }
</style>
