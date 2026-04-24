<script lang="ts">
  let { data } = $props();

  const contacts = $derived(data.contacts);

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
</script>

<svelte:head>
  <title>{data.ofs.name} - Simulations - Espace OFS - BoRiS</title>
</svelte:head>

<h1 class="fr-h3">Simulations</h1>
<p class="fr-text--sm">
  Contacts correspondant au périmètre géographique de cet OFS.
</p>

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
          <th scope="col">Date</th>
          <th scope="col">Contact</th>
          <th scope="col">Localisation</th>
          <th scope="col">Foyer</th>
          <th scope="col">Projet</th>
          <th scope="col">Ressources</th>
        </tr>
      </thead>
      <tbody>
        {#each contacts.items as line}
          <tr>
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
