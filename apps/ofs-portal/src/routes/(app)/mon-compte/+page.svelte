<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head>
  <title>Mon compte - Espace OFS - BoRiS</title>
</svelte:head>

<div class="fr-grid-row fr-grid-row--center">
  <div class="fr-col-12 fr-col-md-10 fr-col-lg-8">
    <h1 class="fr-h3">Mon compte</h1>
    <a class="fr-btn fr-btn--secondary fr-mb-3w" href="/acces-api"
      >Gérer mes clés API</a
    >

    {#if form?.message}
      <div class="fr-alert fr-alert--error fr-mb-3w">
        <p>{form.message}</p>
      </div>
    {/if}

    {#if form?.notificationMessage}
      <div class="fr-alert fr-alert--error fr-mb-3w">
        <p>{form.notificationMessage}</p>
      </div>
    {/if}

    {#if form?.nameError}<div class="fr-alert fr-alert--error" role="alert">
        <p>{form.nameError}</p>
      </div>{/if}
    <form method="POST" action="?/name" class="fr-mt-3w">
      <h2 class="fr-h4">Votre identité</h2>
      <div class="fr-input-group">
        <label class="fr-label" for="firstName">Prénom (facultatif)</label
        ><input
          class="fr-input"
          id="firstName"
          name="firstName"
          autocomplete="given-name"
          maxlength="100"
          value={data.accountName.firstName || ""}
        />
      </div>
      <div class="fr-input-group">
        <label class="fr-label" for="lastName">Nom (facultatif)</label><input
          class="fr-input"
          id="lastName"
          name="lastName"
          autocomplete="family-name"
          maxlength="100"
          value={data.accountName.lastName || ""}
        />
      </div>
      <button class="fr-btn">Enregistrer mon identité</button>
    </form>
    <section class="fr-mt-5w" aria-labelledby="two-factor-title">
      <h2 id="two-factor-title" class="fr-h4">Double authentification</h2>
      {#if data.twoFactor.enabled}
        <p class="fr-badge fr-badge--success">Activée</p>
        <p>
          Votre compte est protégé par un code de votre application
          d’authentification à chaque connexion.
        </p>
        {#if data.twoFactor.canDisable}
          <details class="fr-mt-2w" open={!!form?.twoFactorError}>
            <summary class="fr-link"
              >Désactiver la double authentification</summary
            >
            <p class="fr-mt-2w">
              Votre compte sera protégé uniquement par votre mot de passe.
              Toutes vos sessions seront fermées et vos codes de récupération
              seront invalidés.
            </p>
            {#if form?.twoFactorError}<div
                class="fr-alert fr-alert--error fr-mb-2w"
                role="alert"
              >
                <p>{form.twoFactorError}</p>
              </div>{/if}
            <form method="POST" action="?/disableTwoFactor">
              <div class="fr-input-group">
                <label class="fr-label" for="disable-password"
                  >Mot de passe actuel pour désactiver la double
                  authentification</label
                ><input
                  class="fr-input"
                  id="disable-password"
                  name="currentPassword"
                  type="password"
                  autocomplete="current-password"
                  required
                />
              </div>
              <div class="fr-input-group">
                <label class="fr-label" for="disable-code"
                  >Code de vérification<span class="fr-hint-text"
                    >Utilisez un nouveau code à 6 chiffres de votre application.</span
                  ></label
                ><input
                  class="fr-input"
                  id="disable-code"
                  name="code"
                  inputmode="numeric"
                  autocomplete="one-time-code"
                  pattern={"[0-9]{6}"}
                  maxlength="6"
                  required
                />
              </div>
              <button class="fr-btn fr-btn--secondary"
                >Confirmer la désactivation</button
              >
            </form>
          </details>
        {:else}
          <p class="fr-hint-text">
            La double authentification est obligatoire pour les administrateurs
            et ne peut pas être désactivée.
          </p>
        {/if}
      {:else}
        <p>
          Protégez votre compte avec un code à usage unique généré par votre
          gestionnaire de mots de passe ou votre application d’authentification.
        </p>
        <a
          class="fr-btn fr-btn--secondary"
          href="/configuration-double-authentification"
          >Activer la double authentification</a
        >
      {/if}
    </section>
    <h2 class="fr-h4 fr-mt-5w">Mot de passe</h2>
    <form method="POST" action="?/changePassword" class="fr-mt-3w">
      <div class="fr-input-group">
        <label class="fr-label" for="email">Adresse e-mail</label>
        <input
          class="fr-input"
          id="email"
          type="email"
          value={data.accountEmail}
          readonly
        />
      </div>

      <div class="fr-input-group">
        <label class="fr-label" for="currentPassword">Mot de passe actuel</label
        >
        <input
          class="fr-input"
          id="currentPassword"
          name="currentPassword"
          type="password"
          autocomplete="current-password"
          required
        />
      </div>

      <div class="fr-input-group">
        <label class="fr-label" for="newPassword">Nouveau mot de passe</label>
        <input
          class="fr-input"
          id="newPassword"
          name="newPassword"
          type="password"
          minlength="12"
          autocomplete="new-password"
          required
        />
        <p class="fr-hint-text">12 caractères minimum.</p>
      </div>

      <div class="fr-input-group">
        <label class="fr-label" for="newPasswordConfirmation"
          >Confirmer le nouveau mot de passe</label
        >
        <input
          class="fr-input"
          id="newPasswordConfirmation"
          name="newPasswordConfirmation"
          type="password"
          minlength="12"
          autocomplete="new-password"
          required
        />
      </div>

      <div class="fr-mt-3w">
        <button class="fr-btn" type="submit">Modifier le mot de passe</button>
      </div>
    </form>

    {#if data.notifications.length > 0}
      <section class="fr-mt-7w">
        <h2 class="fr-h4">Notifications des nouvelles pistes</h2>

        <form method="POST" action="?/notifications" class="fr-mt-3w">
          <div class="fr-table fr-table--bordered">
            <table>
              <caption> Préférences de notification par OFS </caption>
              <thead>
                <tr>
                  <th scope="col">OFS</th>
                  <th scope="col">Fréquence</th>
                </tr>
              </thead>
              <tbody>
                {#each data.notifications as notification}
                  <tr>
                    <th scope="row">
                      {notification.ofs.name}
                      <input
                        type="hidden"
                        name="ofsId"
                        value={notification.ofs.id}
                      />
                    </th>
                    <td>
                      <fieldset
                        class="fr-fieldset fr-fieldset--inline fr-mb-0"
                        aria-label={`Fréquence pour ${notification.ofs.name}`}
                      >
                        <div class="fr-fieldset__element">
                          <div class="fr-radio-group">
                            <input
                              id={`notification-none-${notification.ofs.id}`}
                              type="radio"
                              name={`frequency-${notification.ofs.id}`}
                              value="none"
                              checked={notification.frequency === "none"}
                            />
                            <label
                              class="fr-label"
                              for={`notification-none-${notification.ofs.id}`}
                              >Aucune</label
                            >
                          </div>
                        </div>
                        <div class="fr-fieldset__element">
                          <div class="fr-radio-group">
                            <input
                              id={`notification-instant-${notification.ofs.id}`}
                              type="radio"
                              name={`frequency-${notification.ofs.id}`}
                              value="instant"
                              checked={notification.frequency === "instant"}
                            />
                            <label
                              class="fr-label"
                              for={`notification-instant-${notification.ofs.id}`}
                              >À chaque nouveau prospect</label
                            >
                          </div>
                        </div>
                        <div class="fr-fieldset__element">
                          <div class="fr-radio-group">
                            <input
                              id={`notification-daily-${notification.ofs.id}`}
                              type="radio"
                              name={`frequency-${notification.ofs.id}`}
                              value="daily"
                              checked={notification.frequency === "daily"}
                            />
                            <label
                              class="fr-label"
                              for={`notification-daily-${notification.ofs.id}`}
                              >Chaque jour ouvré</label
                            >
                          </div>
                        </div>
                        <div class="fr-fieldset__element">
                          <div class="fr-radio-group">
                            <input
                              id={`notification-weekly-${notification.ofs.id}`}
                              type="radio"
                              name={`frequency-${notification.ofs.id}`}
                              value="weekly"
                              checked={notification.frequency === "weekly"}
                            />
                            <label
                              class="fr-label"
                              for={`notification-weekly-${notification.ofs.id}`}
                              >Chaque lundi</label
                            >
                          </div>
                        </div>
                      </fieldset>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>

          <div class="fr-mt-3w">
            <button class="fr-btn" type="submit"
              >Enregistrer les notifications</button
            >
          </div>
        </form>
      </section>
    {/if}
  </div>
</div>
