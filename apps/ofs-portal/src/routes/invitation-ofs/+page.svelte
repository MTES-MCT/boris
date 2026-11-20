<script lang="ts">
  import { untrack } from "svelte";
  let { data, form } = $props();
  let firstName = $state(
    untrack(() => (form && "firstName" in form ? form.firstName : "")),
  );
  let lastName = $state(
    untrack(() => (form && "lastName" in form ? form.lastName : "")),
  );
  const invitation = $derived(
    form && "invitation" in form ? form.invitation : data.invitation,
  );
  const failure = $derived(form && "error" in form ? form.error : data.error);
</script>

<svelte:head
  ><title>Invitation OFS - BoRiS</title><meta
    name="referrer"
    content="same-origin"
  /></svelte:head
>
<main class="fr-container fr-py-8w">
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
      <h1 class="fr-h3">Rejoindre une équipe OFS</h1>
      {#if form && "success" in form && form.success}
        <div class="fr-alert fr-alert--success" role="status">
          <p>{form.message}</p>
        </div>
        <a class="fr-btn fr-mt-3w" href="/connexion">Se connecter</a>
      {:else}
        {#if failure}<div
            class="fr-alert fr-alert--error fr-mb-3w"
            role="alert"
          >
            <p>{failure}</p>
          </div>{/if}
        {#if invitation}
          <p>
            <strong>{invitation.ofsName}</strong> vous invite à rejoindre son équipe
            sur BoRiS.
          </p>
          <p>Adresse invitée : <strong>{invitation.email}</strong></p>
          <p>
            Vous disposerez des mêmes droits que les autres membres de cet OFS.
          </p>
          <form method="POST">
            <input type="hidden" name="token" value={data.token} />
            {#if invitation.existingAccount}
              <p>
                Vous possédez déjà un compte OFS. Votre mot de passe et vos
                autres accès seront conservés.
              </p>
            {:else}
              <div class="fr-input-group">
                <label class="fr-label" for="firstName">Prénom</label><input
                  class="fr-input"
                  id="firstName"
                  name="firstName"
                  autocomplete="given-name"
                  maxlength="100"
                  bind:value={firstName}
                  required
                />
              </div>
              <div class="fr-input-group">
                <label class="fr-label" for="lastName">Nom</label><input
                  class="fr-input"
                  id="lastName"
                  name="lastName"
                  autocomplete="family-name"
                  maxlength="100"
                  bind:value={lastName}
                  required
                />
              </div>
              <div class="fr-input-group">
                <label class="fr-label" for="password"
                  >Mot de passe<span class="fr-hint-text"
                    >12 caractères minimum.</span
                  ></label
                ><input
                  class="fr-input"
                  id="password"
                  name="password"
                  type="password"
                  minlength="12"
                  maxlength="128"
                  autocomplete="new-password"
                  required
                />
              </div>
            {/if}
            <button class="fr-btn"
              >{invitation.existingAccount
                ? "Accepter l’invitation"
                : "Accepter et créer mon compte"}</button
            >
          </form>
        {/if}
      {/if}
      <p class="fr-mt-4w">
        Besoin d’aide ? <a href={`mailto:${data.supportEmail}`}
          >Contacter l’administration BoRiS</a
        >
      </p>
    </div>
  </div>
</main>
