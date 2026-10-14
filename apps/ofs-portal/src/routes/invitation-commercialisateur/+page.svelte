<script lang="ts">
  let { data, form } = $props();
  const invitation = $derived(
    form && "invitation" in form ? form.invitation : data.invitation,
  );
  const failure = $derived(form && "error" in form ? form.error : data.error);
</script>

<svelte:head
  ><title>Invitation commercialisateur - BoRiS</title><meta
    name="referrer"
    content="no-referrer"
  /></svelte:head
>
<main class="fr-container fr-py-8w">
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
      <h1 class="fr-h3">Invitation commercialisateur</h1>
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
            <strong>{invitation.ofsName}</strong> vous invite à rejoindre BoRiS
            en tant que commercialisateur <strong>{invitation.name}</strong>.
          </p>
          <p>Adresse invitée : <strong>{invitation.email}</strong></p>
          {#if invitation.existingDistributor}
            <p>
              Cette adresse possède déjà un compte chez <strong
                >{invitation.existingDistributor.name}</strong
              >. Accepter rattachera cette organisation à l’OFS, sans créer de
              compte ni modifier votre mot de passe.
            </p>
            <form method="POST">
              <input type="hidden" name="token" value={data.token} /><button
                class="fr-btn">Accepter le rattachement</button
              >
            </form>
          {:else}
            {#if invitation.matches.length}
              <div class="fr-alert fr-alert--info fr-mb-3w">
                <h2 class="fr-alert__title">
                  Votre organisation existe peut-être déjà
                </h2>
                <p>
                  Si elle figure ci-dessous, rattachez-la à l’OFS pour éviter un
                  doublon. Aucun compte ne sera créé. Contactez l’administration
                  BoRiS si vous avez besoin d’un accès à cette organisation.
                </p>
              </div>
              <ul class="matches">
                {#each invitation.matches as match}<li>
                    <strong>{match.name}</strong>
                    <form method="POST">
                      <input
                        type="hidden"
                        name="token"
                        value={data.token}
                      /><input
                        type="hidden"
                        name="distributorId"
                        value={match.id}
                      /><button class="fr-btn fr-btn--secondary fr-btn--sm"
                        >Rattacher cette organisation</button
                      >
                    </form>
                  </li>{/each}
              </ul>
            {/if}
            <form method="POST" class="fr-mt-4w">
              <h2 class="fr-h5">Créer votre compte commercialisateur</h2>
              <input type="hidden" name="token" value={data.token} />
              {#each invitation.matches as match}<input
                  type="hidden"
                  name="reviewedMatchIds"
                  value={match.id}
                />{/each}
              {#if invitation.matches.length}
                <div class="fr-checkbox-group fr-mb-3w">
                  <input
                    id="create-new"
                    type="checkbox"
                    name="createNew"
                    required
                  /><label class="fr-label" for="create-new"
                    >Mon organisation est différente des commercialisateurs
                    suggérés.</label
                  >
                </div>
              {:else}<input type="hidden" name="createNew" value="on" />{/if}
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
              <p class="fr-text--sm">
                Votre compte aura uniquement le rôle commercialisateur et sera
                associé à « {invitation.name} ». L’OFS devra configurer une transmission
                pour partager des contacts.
              </p>
              <button class="fr-btn">Accepter et créer mon compte</button>
            </form>
          {/if}
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

<style>
  .matches {
    list-style: none;
    padding: 0;
  }
  .matches li {
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-default-grey);
  }
  .matches form {
    margin-top: 0.5rem;
  }
</style>
