<script lang="ts">
  import { untrack } from "svelte";
  let { data, form } = $props();
  let email = $state(untrack(() => form?.email || ""));
  const labels = {
    pending: "En attente",
    expired: "Expirée",
    accepted: "Acceptée",
    cancelled: "Annulée",
  };
</script>

<svelte:head><title>Équipe - {data.currentOfs.name} - BoRiS</title></svelte:head
>
<h1 class="fr-h3">Équipe de {data.currentOfs.name}</h1>
<p>
  Retrouvez les personnes qui ont accès à cet OFS et invitez vos collègues. Tous
  les membres disposent des mêmes droits.
</p>
{#if form && "error" in form}<div
    class="fr-alert fr-alert--error fr-mb-3w"
    role="alert"
  >
    <p>{form.error}</p>
  </div>{/if}
{#if form && "message" in form}<div
    class="fr-alert fr-alert--success fr-mb-3w"
    role="status"
  >
    <p>{form.message}</p>
  </div>{/if}
<div class="fr-table fr-table--bordered">
  <table>
    <caption>Membres actuels ({data.members.length})</caption>
    <thead
      ><tr
        ><th scope="col">Prénom</th><th scope="col">Nom</th><th scope="col"
          >Adresse e-mail</th
        ></tr
      ></thead
    >
    <tbody
      >{#each data.members as member}<tr
          ><td>{member.firstName || ""}</td><td>{member.lastName || ""}</td><td
            ><a href={`mailto:${member.email}`}>{member.email}</a></td
          ></tr
        >{/each}</tbody
    >
  </table>
</div>
{#if !data.members.length}<p>Aucun membre actif pour cet OFS.</p>{/if}
<p class="fr-text--sm">
  Vous pouvez ajouter votre prénom et votre nom dans <a href="/mon-compte"
    >Mon compte</a
  >.
</p>
<section class="fr-mt-5w" aria-labelledby="invite-title">
  <h2 id="invite-title" class="fr-h4">Inviter un collègue</h2>
  <p>
    L’invitation est valable 7 jours. Votre collègue devra l’accepter pour
    accéder à cet OFS.
  </p>
  <form method="POST" action="?/invite" class="invite-form">
    <div class="fr-input-group">
      <label class="fr-label" for="colleague-email"
        >Adresse e-mail du collègue</label
      ><input
        class="fr-input"
        id="colleague-email"
        type="email"
        name="email"
        maxlength="254"
        autocomplete="email"
        bind:value={email}
        required
      />
    </div>
    <button class="fr-btn">Envoyer l’invitation</button>
  </form>
</section>
<section class="fr-mt-5w" aria-labelledby="invitations-title">
  <h2 id="invitations-title" class="fr-h4">Invitations</h2>
  {#if data.invitations.length}
    <div class="fr-table fr-table--bordered">
      <table>
        <caption>Invitations de l’équipe</caption><thead
          ><tr
            ><th scope="col">Adresse e-mail</th><th scope="col">Statut</th><th
              scope="col">Échéance</th
            ><th scope="col">Actions</th></tr
          ></thead
        >
        <tbody
          >{#each data.invitations as invitation}<tr
              ><td>{invitation.email}</td><td>{labels[invitation.status]}</td
              ><td
                >{new Date(invitation.expiresAt).toLocaleDateString(
                  "fr-FR",
                )}</td
              ><td>
                {#if invitation.status === "pending" || invitation.status === "expired"}
                  <div class="invitation-actions">
                    <form method="POST" action="?/resend">
                      <input
                        type="hidden"
                        name="invitationId"
                        value={invitation.id}
                      /><button
                        class="fr-btn fr-btn--secondary fr-btn--sm"
                        aria-label={`Renvoyer l’invitation à ${invitation.email}`}
                        >Renvoyer</button
                      >
                    </form>
                    <form method="POST" action="?/cancel">
                      <input
                        type="hidden"
                        name="invitationId"
                        value={invitation.id}
                      /><button
                        class="fr-btn fr-btn--tertiary fr-btn--sm"
                        aria-label={`Annuler l’invitation à ${invitation.email}`}
                        >Annuler</button
                      >
                    </form>
                  </div>
                {:else}—{/if}
              </td></tr
            >{/each}</tbody
        >
      </table>
    </div>
  {:else}<p>Aucune invitation.</p>{/if}
</section>
<div class="fr-callout fr-mt-5w">
  <h2 class="fr-callout__title">Retirer un accès</h2>
  <p class="fr-callout__text">
    Pour retirer l’accès d’un membre à cet OFS, <a
      href={`mailto:${data.supportEmail}`}>contactez l’administration BoRiS</a
    >.
  </p>
</div>

<style>
  .invite-form {
    max-width: 34rem;
  }
  .invitation-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
