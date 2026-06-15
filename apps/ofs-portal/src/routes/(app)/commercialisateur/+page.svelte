<script lang="ts">
  let { data } = $props();

  type ContactLine = (typeof data.contacts.items)[number];
  type SimulationMetadata = {
    simulationId: string;
    action: string | null;
    status: string | null;
  };

  const actionOptions = [
    { value: "RECONTACTED", label: "recontacté" },
    { value: "NOT_RECONTACTED", label: "pas recontacté" },
  ] as const;

  const statusOptions = [
    { value: "NOT_INTERESTED", label: "pas intéressé" },
    { value: "NO_RESPONSE", label: "ne répond pas" },
    { value: "EXCHANGE_IN_PROGRESS", label: "échange en cours" },
    { value: "NOT_FINANCEABLE", label: "non solvable" },
    { value: "WAITING_FOR_LOAN", label: "attente de prêt" },
    { value: "HAS_SIGNED_BRS", label: "a signé un BRS" },
  ] as const;

  let items = $state<ContactLine[]>(data.contacts.items.map((line) => ({ ...line })));
  let savingBySimulationId = $state<Record<string, boolean>>({});
  let startDate = $state("");
  let endDate = $state("");
  let exportDialog: HTMLDialogElement | undefined;

  $effect(() => {
    items = data.contacts.items.map((line) => ({ ...line }));
    savingBySimulationId = {};
  });

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function pageHref(page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", `${page}`);
    if (data.selectedOfsId) params.set("ofsId", data.selectedOfsId);
    return params.toString() ? `?${params.toString()}` : "";
  }

  async function updateMetadata(
    line: ContactLine,
    updates: Partial<Pick<ContactLine, "action" | "status">>,
  ) {
    const previousAction = line.action;
    const previousStatus = line.status;
    if ("action" in updates) line.action = updates.action ?? null;
    if ("status" in updates) line.status = updates.status ?? null;
    savingBySimulationId[line.simulationId] = true;

    try {
      const response = await fetch(
        `/commercialisateur/simulations/${line.simulationId}/metadata`,
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: line.action, status: line.status }),
        },
      );

      if (!response.ok) throw new Error();
      const saved = (await response.json()) as SimulationMetadata;
      line.action = saved.action;
      line.status = saved.status;
    } catch {
      line.action = previousAction;
      line.status = previousStatus;
    } finally {
      savingBySimulationId[line.simulationId] = false;
    }
  }
</script>

<svelte:head>
  <title>Transmissions - Espace commercialisateur - BoRiS</title>
</svelte:head>

<div class="fr-grid-row">
  <div class="fr-col">
    <h1 class="fr-h3">Transmissions commerciales</h1>
    <p class="fr-text--sm">{data.distributor?.name}</p>
  </div>
  <div class="fr-col-2 text-right">
    <button class="fr-btn fr-btn--secondary fr-mb-3w" type="button" onclick={() => exportDialog?.showModal()}>
      Exporter en CSV
    </button>
  </div>
</div>

<dialog bind:this={exportDialog} class="export-dialog">
  <form method="GET" action="/commercialisateur/export">
    <input type="hidden" name="ofsId" value={data.selectedOfsId} />
    <h2 class="fr-h5 fr-mb-2w">Exporter des lignes</h2>
    <label class="fr-label" for="startDate">Date de début</label>
    <input class="fr-input fr-mb-2w" id="startDate" type="date" name="startDate" bind:value={startDate} required />
    <label class="fr-label" for="endDate">Date de fin</label>
    <input class="fr-input fr-mb-2w" id="endDate" type="date" name="endDate" bind:value={endDate} required />
    <button class="fr-btn" type="submit">Télécharger</button>
    <button class="fr-btn fr-btn--secondary" type="button" onclick={() => exportDialog?.close()}>Annuler</button>
  </form>
</dialog>

<section class="fr-mb-3w">
  {#if data.relationships.length}
    <form method="GET">
      <label class="fr-label" for="ofsId">OFS partenaire</label>
      <select class="fr-select" id="ofsId" name="ofsId" onchange={(event) => (event.currentTarget as HTMLSelectElement).form?.submit()}>
        <option value="">Tous les OFS</option>
        {#each data.relationships as relationship}
          <option value={relationship.ofs.id} selected={data.selectedOfsId === relationship.ofs.id}>
            {relationship.ofs.name}
          </option>
        {/each}
      </select>
    </form>
  {:else}
    <div class="fr-alert fr-alert--info">
      <p>Aucune transmission active pour le moment.</p>
    </div>
  {/if}
</section>

{#if data.relationships.length}
  <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
    {#each data.relationships as relationship}
      <section class="fr-col-12 fr-col-md-4">
        <div class="relationship">
          <h2 class="fr-h6">{relationship.ofs.name}</h2>
          <p class="fr-text--sm">{relationship.ofs.email || "-"}<br />{relationship.ofs.phone || "-"}</p>
          {#if relationship.ofs.websiteUrl}
            <a class="fr-link" href={relationship.ofs.websiteUrl} target="_blank" rel="noreferrer">Site web</a>
          {/if}
        </div>
      </section>
    {/each}
  </div>
{/if}

{#if items.length}
  <div class="fr-table fr-table--bordered">
    <table>
      <caption>{data.contacts.totalCount} contact(s)</caption>
      <thead>
        <tr>
          <th scope="col">Suivi</th>
          <th scope="col">OFS</th>
          <th scope="col">Date</th>
          <th scope="col">Contact</th>
          <th scope="col">Localisation</th>
        </tr>
      </thead>
      <tbody>
        {#each items as line}
          <tr>
            <td>
              <select class="fr-select fr-mb-1w" bind:value={line.action} disabled={savingBySimulationId[line.simulationId]} onchange={(event) => updateMetadata(line, { action: (event.currentTarget as HTMLSelectElement).value || null })}>
                <option value="">Action</option>
                {#each actionOptions as option}<option value={option.value}>{option.label}</option>{/each}
              </select>
              <select class="fr-select" bind:value={line.status} disabled={savingBySimulationId[line.simulationId]} onchange={(event) => updateMetadata(line, { status: (event.currentTarget as HTMLSelectElement).value || null })}>
                <option value="">Statut</option>
                {#each statusOptions as option}<option value={option.value}>{option.label}</option>{/each}
              </select>
            </td>
            <td>{line.ofs?.name || "-"}</td>
            <td>{formatDate(line.submittedAt)}</td>
            <td><strong>{line.fullName || "Contact sans nom"}</strong><br />{line.email || "-"}<br />{line.phone || "-"}</td>
            <td>{line.city || "-"}<br />{line.departementCode ? `Département ${line.departementCode}` : "-"}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if data.contacts.pagesCount > 1}
    <nav class="fr-pagination fr-mt-3w" aria-label="Pagination">
      <ul class="fr-pagination__list">
        <li><a class="fr-pagination__link fr-pagination__link--prev" href={pageHref(data.contacts.page - 1)} aria-disabled={!data.contacts.hasPreviousPage}>Précédent</a></li>
        <li><a class="fr-pagination__link fr-pagination__link--next" href={pageHref(data.contacts.page + 1)} aria-disabled={!data.contacts.hasNextPage}>Suivant</a></li>
      </ul>
    </nav>
  {/if}
{:else if data.relationships.length}
  <div class="fr-alert fr-alert--info"><p>Aucune ligne de contact ne correspond au périmètre actif.</p></div>
{/if}

<style>
  .relationship {
    background: white;
    border-radius: 0.5rem;
    min-height: 9rem;
    padding: 1rem;
  }

  .export-dialog {
    border: 0;
    border-radius: 0.5rem;
    max-width: 26rem;
    padding: 2rem;
  }
</style>
