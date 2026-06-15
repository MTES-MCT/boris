<script lang="ts">
  let { data } = $props();

  const contacts = $derived(data.contacts);

  type ContactLine = {
    simulationId: string;
    locationId: string;
    submittedAt: string;
    fullName: string | null;
    email: string | null;
    phone: string | null;
    departementCode: string | null;
    city: string | null;
    contribution: number | null;
    householdSize: number | null;
    hasDisability: boolean | null;
    taxableIncome: number | null;
    propertySituation: string | null;
    housingType: string | null;
    resources: number | null;
    action: string | null;
    status: string | null;
    isNew: boolean;
    transmittedDistributors: { id: string; name: string }[];
  };

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

  let items = $state<ContactLine[]>(
    data.contacts.items.map((line: ContactLine) => ({ ...line })),
  );
  let savingBySimulationId = $state<Record<string, boolean>>({});
  let errorBySimulationId = $state<Record<string, string>>({});

  let exportDialog: HTMLDialogElement | undefined;
  let startDate = $state("");
  let endDate = $state("");
  let exportError = $state("");

  $effect(() => {
    items = data.contacts.items.map((line: ContactLine) => ({ ...line }));
    savingBySimulationId = {};
    errorBySimulationId = {};
  });

  function pageHref(page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", `${page}`);
    return params.toString() ? `?${params.toString()}` : "";
  }

  function formatDate(value: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function openExportDialog() {
    exportError = "";
    exportDialog?.showModal();
  }

  function closeExportDialog() {
    exportError = "";
    exportDialog?.close();
  }

  async function updateMetadata(
    line: ContactLine,
    updates: Partial<Pick<ContactLine, "action" | "status">>,
  ) {
    if (savingBySimulationId[line.simulationId]) {
      return;
    }

    const previousAction = line.action;
    const previousStatus = line.status;

    if ("action" in updates) {
      line.action = updates.action ?? null;
    }

    if ("status" in updates) {
      line.status = updates.status ?? null;
    }

    savingBySimulationId[line.simulationId] = true;
    errorBySimulationId[line.simulationId] = "";

    try {
      const response = await fetch(
        `/ofs/${data.ofs.id}/simulations/${line.simulationId}/metadata`,
        {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: line.action,
          status: line.status,
        }),
        },
      );

      if (response.status === 401) {
        window.location.href = `/connexion?returnTo=${encodeURIComponent(window.location.pathname + window.location.search)}`;
        return;
      }

      if (!response.ok) {
        throw new Error("La mise à jour a échoué.");
      }

      const saved = (await response.json()) as SimulationMetadata;

      line.action = saved.action;
      line.status = saved.status;
    } catch {
      line.action = previousAction;
      line.status = previousStatus;
      errorBySimulationId[line.simulationId] =
        "La mise à jour a échoué.";
    } finally {
      savingBySimulationId[line.simulationId] = false;
    }
  }

  function handleExportSubmit(event: SubmitEvent) {
    const form = event.currentTarget as HTMLFormElement;

    if (!form.reportValidity()) {
      event.preventDefault();
      return;
    }

    if (startDate > endDate) {
      event.preventDefault();
      exportError =
        "La date de début doit être antérieure ou égale à la date de fin.";
      return;
    }

    exportError = "";
    exportDialog?.close();
  }
</script>

<svelte:head>
  <title>{data.ofs.name} - Simulations - Espace OFS - BoRiS</title>
</svelte:head>

<div class="fr-grid-row">
  <div class="fr-col">
    <h1 class="fr-h3">Simulations</h1>
    <p class="fr-text--sm">
      Contacts correspondant au périmètre géographique de cet OFS.
    </p>
  </div>

  <div class="fr-col-2 text-right">
    <button
      class="fr-btn fr-btn--secondary fr-mb-3w"
      type="button"
      onclick={openExportDialog}
    >
      Exporter en CSV
    </button>
  </div>
</div>

<dialog
  bind:this={exportDialog}
  class="export-dialog"
  aria-labelledby="export-dialog-title"
>
  <form
    method="GET"
    action={`/ofs/${data.ofs.id}/simulations/export`}
    onsubmit={handleExportSubmit}
  >
    <h2 class="fr-h5 fr-mb-2w" id="export-dialog-title">Exporter des lignes</h2>

    <div class="fr-input-group fr-mb-2w">
      <label class="fr-label" for="export-start-date">Date de début</label>
      <input
        id="export-start-date"
        class="fr-input"
        type="date"
        name="startDate"
        bind:value={startDate}
        max={endDate || undefined}
        required
      />
    </div>

    <div class="fr-input-group fr-mb-2w">
      <label class="fr-label" for="export-end-date">Date de fin</label>
      <input
        id="export-end-date"
        class="fr-input"
        type="date"
        name="endDate"
        bind:value={endDate}
        min={startDate || undefined}
        required
      />
    </div>

    {#if exportError}
      <div class="fr-alert fr-alert--error fr-mb-2w">
        <p>{exportError}</p>
      </div>
    {/if}

    <div class="export-dialog__actions">
      <button class="fr-btn" type="submit">Télécharger le CSV</button>
      <button
        class="fr-btn fr-btn--secondary"
        type="button"
        onclick={closeExportDialog}
      >
        Annuler
      </button>
    </div>
  </form>
</dialog>

{#if contacts.items.length > 0}
  {#if contacts.items.some((line) => line.isNew)}
    <div class="fr-alert fr-alert--info fr-mb-2w">
      <p>
        {contacts.items.filter((line) => line.isNew).length} nouvelle(s) ligne(s)
        depuis votre précédente connexion.
      </p>
    </div>
  {/if}

  <div class="fr-table fr-table--bordered">
    <table>
      <caption>{contacts.totalCount} contact(s)</caption>
      <thead>
        <tr>
          <th scope="col">Infos</th>
          <th scope="col">Date</th>
          <th scope="col">Contact</th>
          <th scope="col">Localisation</th>
          <th scope="col">Foyer</th>
          <th scope="col">Projet</th>
          <th scope="col">Ressources</th>
          <th scope="col">Transmis à</th>
        </tr>
      </thead>
      <tbody>
        {#each items as line}
          <tr>
            <td>
              <div class="simulation-metadata-stack">
                <div class="fr-select-group simulation-metadata-field">
                  <label class="fr-label fr-mb-1v" for={`action-${line.locationId}`}
                    >Action</label
                  >
                  <select
                    id={`action-${line.locationId}`}
                    class="fr-select"
                    bind:value={line.action}
                    disabled={savingBySimulationId[line.simulationId]}
                    onchange={async (event) => {
                      const target = event.currentTarget as HTMLSelectElement;
                      await updateMetadata(line, {
                        action: target.value || null,
                      });
                    }}
                  >
                    <option value="">-</option>
                    {#each actionOptions as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </div>

                <div class="fr-select-group simulation-metadata-field">
                  <label class="fr-label fr-mb-1v" for={`status-${line.locationId}`}
                    >Statut</label
                  >
                  <select
                    id={`status-${line.locationId}`}
                    class="fr-select"
                    bind:value={line.status}
                    disabled={savingBySimulationId[line.simulationId]}
                    onchange={async (event) => {
                      const target = event.currentTarget as HTMLSelectElement;
                      await updateMetadata(line, {
                        status: target.value || null,
                      });
                    }}
                  >
                    <option value="">-</option>
                    {#each statusOptions as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </div>

                {#if savingBySimulationId[line.simulationId]}
                  <p class="fr-hint-text fr-mt-1v">Mise à jour...</p>
                {:else if errorBySimulationId[line.simulationId]}
                  <p class="fr-error-text fr-mt-1v">
                    {errorBySimulationId[line.simulationId]}
                  </p>
                {/if}
              </div>
            </td>
            <td>
              <div>{formatDate(line.submittedAt)}</div>
              {#if line.isNew}
                <span class="fr-badge fr-badge--green-menthe fr-badge--sm"
                  >Nouveau</span
                >
              {/if}
            </td>
            <td>
              <strong>{line.fullName || "Contact sans nom"}</strong><br />
              {line.email || "-"}<br />
              {line.phone || "-"}
            </td>
            <td>
              {line.city || "-"}<br />
              {line.departementCode
                ? `Département ${line.departementCode}`
                : "-"}
            </td>
            <td>
              {line.householdSize ?? "-"} personne(s)<br />
              Handicap: {line.hasDisability === null
                ? "-"
                : line.hasDisability
                  ? "Oui"
                  : "Non"}
            </td>
            <td>
              {line.propertySituation || "-"}<br />
              {line.housingType || "-"}<br />
              Apport: {line.contribution
                ? formatCurrency(line.contribution)
                : "-"}
            </td>
            <td>
              Revenus imposables: {line.taxableIncome
                ? formatCurrency(line.taxableIncome)
                : "-"}<br />
              Ressources: {line.resources
                ? formatCurrency(line.resources)
                : "-"}
            </td>
            <td>
              {#if line.transmittedDistributors.length}
                <ul class="fr-tags-group">
                  {#each line.transmittedDistributors as distributor}
                    <li><p class="fr-tag">{distributor.name}</p></li>
                  {/each}
                </ul>
              {:else}
                -
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if contacts.pagesCount > 1}
    <nav class="fr-pagination" aria-label="Pagination des contacts">
      <ul class="fr-pagination__list">
        <li>
          {#if contacts.hasPreviousPage}
            <a
              class="fr-pagination__link fr-pagination__link--prev"
              href={pageHref(contacts.page - 1)}>Page précédente</a
            >
          {:else}
            <span
              class="fr-pagination__link fr-pagination__link--prev"
              aria-disabled="true">Page précédente</span
            >
          {/if}
        </li>
        {#each Array.from({ length: contacts.pagesCount }, (_, index) => index + 1) as page}
          <li>
            <a
              class="fr-pagination__link"
              aria-current={page === contacts.page ? "page" : undefined}
              href={pageHref(page)}>{page}</a
            >
          </li>
        {/each}
        <li>
          {#if contacts.hasNextPage}
            <a
              class="fr-pagination__link fr-pagination__link--next"
              href={pageHref(contacts.page + 1)}>Page suivante</a
            >
          {:else}
            <span
              class="fr-pagination__link fr-pagination__link--next"
              aria-disabled="true">Page suivante</span
            >
          {/if}
        </li>
      </ul>
    </nav>
  {/if}
{:else}
  <div class="fr-alert fr-alert--info">
    <p>
      Aucun contact exploitable ne correspond actuellement au périmètre de cet
      OFS.
    </p>
  </div>
{/if}

<style>
  .export-dialog {
    border: 0;
    border-radius: 1rem;
    max-width: 32rem;
    padding: 0;
    width: calc(100% - 2rem);
  }

  .export-dialog::backdrop {
    background: rgb(0 0 0 / 45%);
  }

  .export-dialog form {
    padding: 2rem;
  }

  .export-dialog__actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .simulation-metadata-field {
    margin-bottom: 0;
    min-width: 12rem;
  }

  .simulation-metadata-stack {
    display: grid;
    gap: 0.75rem;
    min-width: 14rem;
  }

  @media (max-width: 48rem) {
    .export-dialog__actions {
      flex-direction: column;
    }
  }
</style>
