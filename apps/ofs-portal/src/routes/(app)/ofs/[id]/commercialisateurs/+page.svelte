<script lang="ts">
  import { enhance } from "$app/forms";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { DistributorSummary } from "$lib/server/distributor-invitations";
  let { data, form } = $props();
  let name = $state(form?.name || "");
  let matches = $state<DistributorSummary[]>([]);
  let checkedName = $state("");
  let searchError = $state("");
  let newReseller = $state(false);
  let searching = $state(false);
  const labels = {
    pending: "En attente",
    accepted: "Acceptée",
    expired: "Expirée",
    cancelled: "Annulée",
  };

  const completeAdd: SubmitFunction =
    () =>
    async ({ result, update }) => {
      await update();
      if (result.type === "success") {
        name = "";
        newReseller = false;
      }
    };

  $effect(() => {
    const query = name.trim();
    newReseller = false;
    matches = [];
    checkedName = "";
    searchError = "";
    if (!query) {
      searching = false;
      return;
    }
    searching = true;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `/ofs/${data.ofs.id}/commercialisateurs/recherche?name=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Recherche indisponible");
        const results = await response.json();
        if (!controller.signal.aborted) {
          matches = results;
          checkedName = query;
        }
      } catch {
        if (!controller.signal.aborted)
          searchError =
            "La recherche est indisponible. Réessayez avant de créer une invitation.";
      } finally {
        if (!controller.signal.aborted) searching = false;
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  });
</script>

<svelte:head><title>Commercialisateurs - BoRiS</title></svelte:head>
<h1>Commercialisateurs</h1>
<p>
  Rattachez vos partenaires à {data.ofs.name}, puis choisissez les contacts à
  partager dans les
  <a href={`/ofs/${data.ofs.id}/transmissions`}>transmissions commerciales</a>.
</p>
{#if form?.message}<div
    class="fr-alert fr-alert--success fr-mb-3w"
    role="status"
  >
    <p>{form.message}</p>
  </div>{/if}
{#if form?.error}<div class="fr-alert fr-alert--error fr-mb-3w" role="alert">
    <p>{form.error}</p>
  </div>{/if}

<section class="fr-p-3w fr-mb-4w partner-search">
  <h2 class="fr-h4">Ajouter un commercialisateur</h2>
  <div class="fr-input-group">
    <label class="fr-label" for="reseller-name"
      >Nom du commercialisateur<span class="fr-hint-text"
        >Vérifiez les suggestions pour éviter de créer un doublon.</span
      ></label
    >
    <input
      id="reseller-name"
      class="fr-input"
      bind:value={name}
      maxlength="200"
      autocomplete="off"
    />
  </div>
  <div aria-live="polite">
    {#if searching}<p>Recherche de commercialisateurs…</p>{/if}
    {#if searchError}<p class="fr-error-text">{searchError}</p>{/if}
    {#if checkedName}
      {#if matches.length}
        <h3 class="fr-h6">Commercialisateurs existants</h3>
        <p class="fr-text--sm">
          Le commercialisateur sélectionné sera rattaché à votre OFS. Aucun
          compte ni invitation ne sera créé. Vous pourrez ensuite configurer une
          transmission commerciale.
        </p>
        <ul class="partner-results">
          {#each matches as match}
            <li>
              <span>{match.name}</span>
              {#if data.ofs.distributors.some((item) => item.id === match.id)}
                <span class="fr-badge fr-badge--success fr-badge--no-icon"
                  >Déjà rattaché</span
                >
              {:else}
                <form method="POST" action="?/link" use:enhance={completeAdd}>
                  <input type="hidden" name="distributorId" value={match.id} />
                  <button class="fr-btn fr-btn--secondary fr-btn--sm"
                    >Rattacher</button
                  >
                </form>
              {/if}
            </li>
          {/each}
        </ul>
      {:else}<p>Aucun commercialisateur similaire trouvé.</p>{/if}
      <button
        type="button"
        class="fr-btn fr-btn--tertiary"
        onclick={() => (newReseller = true)}
        >Inviter un nouveau commercialisateur</button
      >
    {/if}
  </div>
  {#if newReseller && checkedName === name.trim()}
    <form
      method="POST"
      action="?/invite"
      use:enhance={completeAdd}
      class="fr-mt-3w"
    >
      <h3 class="fr-h6">Inviter « {checkedName} »</h3>
      <input type="hidden" name="name" value={checkedName} />
      <div class="fr-input-group">
        <label class="fr-label" for="email"
          >Adresse e-mail du premier compte commercialisateur</label
        >
        <input
          class="fr-input"
          id="email"
          name="email"
          type="email"
          value={form?.email || ""}
          maxlength="254"
          required
        />
      </div>
      <p class="fr-text--sm">
        L’invitation est valable 7 jours. Le commercialisateur et son compte
        seront créés à l’acceptation. Si cette adresse possède déjà un compte
        commercialisateur, son organisation sera directement rattachée à votre
        OFS.
      </p>
      <button class="fr-btn">Envoyer l’invitation</button>
    </form>
  {/if}
</section>

<h2 class="fr-h4">Commercialisateurs rattachés</h2>
{#if data.ofs.distributors.length}
  <p class="fr-text--sm">
    Dépliez un commercialisateur pour voir les adresses e-mail des comptes ayant
    accès.
  </p>
  <ul class="linked-partners fr-mb-3w">
    {#each data.ofs.distributors as item (item.id)}
      <li>
        <details>
          <summary>{item.name}</summary>
          {#if item.emails.length}
            <ul class="partner-emails">
              {#each item.emails as email}<li>{email}</li>{/each}
            </ul>
          {:else}
            <p class="fr-text--sm fr-mb-0">
              Aucun compte actif pour ce commercialisateur.
            </p>
          {/if}
        </details>
      </li>
    {/each}
  </ul>
{:else}<p>Aucun commercialisateur rattaché pour le moment.</p>{/if}
<a
  class="fr-btn fr-btn--secondary fr-mb-4w"
  href={`/ofs/${data.ofs.id}/transmissions`}>Configurer les transmissions</a
>

<h2 class="fr-h4">Invitations</h2>
{#if data.invitations.length}
  <div class="fr-table">
    <table>
      <caption>Invitations de {data.ofs.name}</caption>
      <thead
        ><tr
          ><th scope="col">Commercialisateur</th><th scope="col">E-mail</th><th
            scope="col">État</th
          ><th scope="col">Actions</th></tr
        ></thead
      >
      <tbody
        >{#each data.invitations as invitation}<tr>
            <td>{invitation.name}</td><td>{invitation.email}</td>
            <td
              >{labels[invitation.status]}<br /><span class="fr-text--xs"
                >Échéance : {new Date(invitation.expiresAt).toLocaleDateString(
                  "fr-FR",
                  { timeZone: "Europe/Paris" },
                )}</span
              ></td
            >
            <td
              >{#if invitation.status === "pending" || invitation.status === "expired"}
                <form
                  method="POST"
                  action="?/resend"
                  use:enhance
                  class="fr-mb-1w"
                >
                  <input
                    type="hidden"
                    name="invitationId"
                    value={invitation.id}
                  /><button class="fr-btn fr-btn--secondary fr-btn--sm"
                    >Renvoyer</button
                  >
                </form>
                <form method="POST" action="?/cancel" use:enhance>
                  <input
                    type="hidden"
                    name="invitationId"
                    value={invitation.id}
                  /><button class="fr-btn fr-btn--tertiary fr-btn--sm"
                    >Annuler</button
                  >
                </form>
              {/if}</td
            >
          </tr>{/each}</tbody
      >
    </table>
  </div>
{:else}<p>Aucune invitation.</p>{/if}
<noscript
  ><p>
    Activez JavaScript pour rechercher et inviter un commercialisateur.
  </p></noscript
>

<style>
  .linked-partners {
    list-style: none;
    padding: 0;
    border-top: 1px solid var(--border-default-grey);
  }
  .linked-partners > li {
    padding: 0;
    border-bottom: 1px solid var(--border-default-grey);
  }
  .linked-partners details {
    padding: 1rem;
  }
  .linked-partners summary {
    cursor: pointer;
    color: var(--text-action-high-blue-france);
    font-weight: 700;
  }
  .linked-partners details[open] summary {
    margin-bottom: 1rem;
  }
  .partner-emails {
    list-style: none;
    padding: 0;
    overflow-wrap: anywhere;
  }
  .partner-search {
    background: var(--background-alt-grey);
  }
  .partner-results {
    list-style: none;
    padding: 0;
  }
  .partner-results li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-default-grey);
  }
  .partner-results li:last-child {
    margin-bottom: 1rem;
  }
</style>
