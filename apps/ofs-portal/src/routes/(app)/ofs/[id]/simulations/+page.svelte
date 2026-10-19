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
    inseeCode: string | null;
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

  type ContactGroup = ContactLine & { locations: ContactLine[] };

  function groupContacts(lines: ContactLine[]): ContactGroup[] {
    const groups = new Map<string, ContactGroup>();
    for (const line of lines) {
      const group = groups.get(line.simulationId);
      if (group) {
        group.locations.push(line);
        for (const distributor of line.transmittedDistributors) {
          if (
            !group.transmittedDistributors.some(
              (item) => item.id === distributor.id,
            )
          ) {
            group.transmittedDistributors.push(distributor);
          }
        }
      } else {
        groups.set(line.simulationId, {
          ...line,
          transmittedDistributors: [...line.transmittedDistributors],
          locations: [line],
        });
      }
    }
    return [...groups.values()];
  }

  function locationLabel(location: ContactLine) {
    return (
      location.city ||
      (location.departementCode
        ? `Département ${location.departementCode}`
        : "Localisation non renseignée")
    );
  }

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

  let items = $state<ContactGroup[]>(groupContacts(data.contacts.items));
  let savingBySimulationId = $state<Record<string, boolean>>({});
  let errorBySimulationId = $state<Record<string, string>>({});

  let exportDialog: HTMLDialogElement | undefined;
  let startDate = $state("");
  let endDate = $state("");
  let exportError = $state("");

  $effect(() => {
    items = groupContacts(data.contacts.items);
    savingBySimulationId = {};
    errorBySimulationId = {};
  });

  function pageHref(page: number) {
    const params = new URLSearchParams();
    if (data.filters.location) params.set("location", data.filters.location);
    if (data.filters.contact) params.set("contact", data.filters.contact);
    if (page > 1) params.set("page", `${page}`);
    return params.toString() ? `?${params.toString()}` : `?page=1`;
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
      errorBySimulationId[line.simulationId] = "La mise à jour a échoué.";
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
      Une ligne par simulation, avec toutes les localisations de votre
      périmètre. Dépliez les localisations pour consulter leurs codes et leurs
      destinataires.
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
    <input type="hidden" name="location" value={data.filters.location} />
    <input type="hidden" name="contact" value={data.filters.contact} />
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

<form
  id="contact-filters"
  method="GET"
  action={`/ofs/${data.ofs.id}/simulations`}
  class="contact-filters fr-mb-2w"
>
  <div class="fr-input-group contact-filter-field">
    <label class="fr-label" for="contact-filter">Contact</label>
    <input
      id="contact-filter"
      class="fr-input"
      type="search"
      name="contact"
      placeholder="Nom, prénom ou email"
      value={data.filters.contact}
    />
  </div>
  <div class="fr-input-group contact-filter-field">
    <label class="fr-label" for="location-filter">Localisation</label>
    <input
      id="location-filter"
      class="fr-input"
      type="search"
      name="location"
      placeholder="Ville, code INSEE ou département"
      value={data.filters.location}
    />
  </div>
  <div class="contact-filter-actions">
    <button class="fr-btn fr-btn--sm" type="submit">Filtrer</button>
    {#if data.filters.location || data.filters.contact}
      <a
        class="fr-btn fr-btn--sm fr-btn--tertiary"
        href={`/ofs/${data.ofs.id}/simulations`}
      >
        Effacer les filtres
      </a>
    {/if}
  </div>
</form>

{#if items.some((line) => line.isNew)}
  <div class="fr-alert fr-alert--info fr-mb-2w">
    <p>
      {items.filter((line) => line.isNew).length} nouveau(x) contact(s) sur cette
      page depuis votre précédente connexion.
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
        <th scope="col">Localisations</th>
        <th scope="col">Foyer</th>
        <th scope="col">Projet</th>
        <th scope="col">Ressources</th>
        <th scope="col">Transmis à</th>
      </tr>
    </thead>
    <tbody>
      {#each items as line (line.simulationId)}
        <tr>
          <td>
            <div class="simulation-metadata-stack">
              <div class="fr-select-group simulation-metadata-field">
                <label
                  class="fr-label fr-mb-1v"
                  for={`action-${line.simulationId}`}>Action</label
                >
                <select
                  id={`action-${line.simulationId}`}
                  class="fr-select"
                  value={line.action ?? ""}
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
                <label
                  class="fr-label fr-mb-1v"
                  for={`status-${line.simulationId}`}>Statut</label
                >
                <select
                  id={`status-${line.simulationId}`}
                  class="fr-select"
                  value={line.status ?? ""}
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
            <details class="contact-locations">
              <summary>
                <span class="contact-locations__cities">
                  {line.locations
                    .slice(0, 2)
                    .map(locationLabel)
                    .join(", ")}{#if line.locations.length > 2}
                    <span class="fr-text--sm">
                      {" "}et {line.locations.length - 2} autre(s)</span
                    >
                  {/if}
                </span>
                <span class="contact-locations__hint">
                  {line.locations.length} localisation(s) · Voir les détails
                </span>
              </summary>
              <ul class="contact-locations__list">
                {#each line.locations as location (location.locationId)}
                  <li>
                    <strong>{locationLabel(location)}</strong><br />
                    Code INSEE : {location.inseeCode || "-"}<br />
                    Département : {location.departementCode || "-"}<br />
                    Transmis à : {location.transmittedDistributors
                      .map((distributor) => distributor.name)
                      .join(", ") || "Aucun commercialisateur"}
                  </li>
                {/each}
              </ul>
            </details>
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
            Ressources: {line.resources ? formatCurrency(line.resources) : "-"}
          </td>
          <td>
            {#if line.transmittedDistributors.length}
              <p class="fr-hint-text">
                Selon la localisation (voir les détails)
              </p>
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
      {:else}
        <tr>
          <td colspan="8">
            {#if data.filters.location || data.filters.contact}
              Aucun contact ne correspond aux filtres sélectionnés.
            {:else}
              Aucun contact exploitable ne correspond actuellement au périmètre
              de cet OFS.
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

<style>
  tbody td {
    vertical-align: top;
  }

  .contact-locations {
    min-width: 14rem;
    max-width: 24rem;
  }

  .contact-locations summary {
    cursor: pointer;
    color: var(--text-action-high-blue-france);
  }

  .contact-locations summary:focus-visible {
    outline: 2px solid var(--border-action-high-blue-france);
    outline-offset: 4px;
  }

  .contact-locations__cities {
    font-weight: 700;
  }

  .contact-locations__hint {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.75rem;
    text-decoration: underline;
  }

  .contact-locations__list {
    margin: 0.75rem 0 0;
    padding-left: 1rem;
    font-size: 0.875rem;
  }

  .contact-locations__list li + li {
    margin-top: 0.75rem;
  }

  .contact-filters {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .contact-filter-field {
    flex: 1 1 16rem;
    margin-bottom: 0;
  }

  .contact-filter-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

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
