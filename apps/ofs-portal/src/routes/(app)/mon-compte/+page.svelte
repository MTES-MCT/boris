<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head>
  <title>Mon compte - Espace OFS - BoRiS</title>
</svelte:head>

<div class="fr-grid-row fr-grid-row--center">
  <div class="fr-col-12 fr-col-md-10 fr-col-lg-8">
    <h1 class="fr-h3">Mon compte</h1>

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

    <form method="POST" class="fr-mt-3w">
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
        <label class="fr-label" for="currentPassword"
          >Mot de passe actuel</label
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
              <caption>
                Préférences de notification par OFS
              </caption>
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
