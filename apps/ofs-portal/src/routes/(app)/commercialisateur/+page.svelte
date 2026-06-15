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

  let items = $state<ContactLine[]>(
    data.contacts.items.map((line) => ({ ...line })),
  );
  let savingBySimulationId = $state<Record<string, boolean>>({});
  let startDate = $state("");
  let endDate = $state("");
  let exportError = $state("");
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

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatPropertySituation(value: string | null) {
    switch (value) {
      case "PROPRIETAIRE":
        return "Propriétaire d'un logement";
      case "LOCATAIRE_SOCIAL":
        return "Locataire d'un logement social";
      case "LOCATAIRE_PRIVE":
        return "Locataire d'un logement privé";
      case "HEBERGE":
        return "Hébergé·e";
      case "AUTRE":
        return "Autre";
      default:
        return value || "-";
    }
  }

  function pageHref(page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", `${page}`);
    if (data.selectedOfsId) params.set("ofsId", data.selectedOfsId);
    return params.toString() ? `?${params.toString()}` : "";
  }

  function openExportDialog() {
    exportError = "";
    exportDialog?.showModal();
  }

  function closeExportDialog() {
    exportError = "";
    exportDialog?.close();
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
  <title>Mes contacts - Espace commercialisateur - BoRiS</title>
</svelte:head>

<div class="fr-grid-row">
  <div class="fr-col">
    <h1 class="fr-h3">Mes contacts</h1>
    <p class="fr-text--sm">{data.distributor?.name}</p>
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
    action="/commercialisateur/export"
    onsubmit={handleExportSubmit}
  >
    <input type="hidden" name="ofsId" value={data.selectedOfsId} />
    <h2 class="fr-h5 fr-mb-2w" id="export-dialog-title">Exporter des lignes</h2>

    <div class="fr-input-group fr-mb-2w">
      <label class="fr-label" for="export-start-date">Date de début</label>
      <input
        class="fr-input"
        id="export-start-date"
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
        class="fr-input"
        id="export-end-date"
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
        onclick={closeExportDialog}>Annuler</button
      >
    </div>
  </form>
</dialog>

{#if items.length}
  <div class="fr-table fr-table--bordered contacts-table">
    <table>
      <caption>{data.contacts.totalCount} contact(s)</caption>
      <thead>
        <tr>
          <th scope="col">Suivi</th>
          {#if !data.selectedOfsId}
            <th scope="col">OFS</th>
          {/if}
          <th scope="col">Date</th>
          <th scope="col">Contact</th>
          <th scope="col">Localisation</th>
          <th scope="col">Foyer</th>
          <th scope="col">Projet</th>
          <th scope="col">Ressources</th>
        </tr>
      </thead>
      <tbody>
        {#each items as line}
          <tr>
            <td>
              <select
                class="fr-select fr-mb-1w"
                bind:value={line.action}
                disabled={savingBySimulationId[line.simulationId]}
                onchange={(event) =>
                  updateMetadata(line, {
                    action:
                      (event.currentTarget as HTMLSelectElement).value || null,
                  })}
              >
                <option value="">Action</option>
                {#each actionOptions as option}<option value={option.value}
                    >{option.label}</option
                  >{/each}
              </select>
              <select
                class="fr-select"
                bind:value={line.status}
                disabled={savingBySimulationId[line.simulationId]}
                onchange={(event) =>
                  updateMetadata(line, {
                    status:
                      (event.currentTarget as HTMLSelectElement).value || null,
                  })}
              >
                <option value="">Statut</option>
                {#each statusOptions as option}<option value={option.value}
                    >{option.label}</option
                  >{/each}
              </select>
            </td>
            {#if !data.selectedOfsId}
              <td>{line.ofs?.name || "-"}</td>
            {/if}
            <td>{formatDate(line.submittedAt)}</td>
            <td
              ><strong>{line.fullName || "Contact sans nom"}</strong><br
              />{line.email || "-"}<br />{line.phone || "-"}</td
            >
            <td
              >{line.city || "-"}<br />{line.departementCode
                ? `Département ${line.departementCode}`
                : "-"}</td
            >
            <td>
              {line.householdSize ?? "-"} personne(s)<br />
              Handicap: {line.hasDisability === null
                ? "-"
                : line.hasDisability
                  ? "Oui"
                  : "Non"}
            </td>
            <td>
              {formatPropertySituation(line.propertySituation)}<br />
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
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  {#if data.contacts.pagesCount > 1}
    <nav class="fr-pagination fr-mt-3w" aria-label="Pagination">
      <ul class="fr-pagination__list">
        <li>
          <a
            class="fr-pagination__link fr-pagination__link--prev"
            href={pageHref(data.contacts.page - 1)}
            aria-disabled={!data.contacts.hasPreviousPage}>Précédent</a
          >
        </li>
        <li>
          <a
            class="fr-pagination__link fr-pagination__link--next"
            href={pageHref(data.contacts.page + 1)}
            aria-disabled={!data.contacts.hasNextPage}>Suivant</a
          >
        </li>
      </ul>
    </nav>
  {/if}
{:else if data.relationships.length}
  <div class="fr-alert fr-alert--info">
    <p>Aucune ligne de contact ne correspond au périmètre actif.</p>
  </div>
{:else}
  <div class="fr-alert fr-alert--info">
    <p>Aucune transmission active pour le moment.</p>
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

  .contacts-table {
    width: 100%;
  }

  .contacts-table :global(table) {
    min-width: 78rem;
    width: 100%;
  }

  @media (max-width: 48rem) {
    .export-dialog__actions {
      flex-direction: column;
    }
  }
</style>
