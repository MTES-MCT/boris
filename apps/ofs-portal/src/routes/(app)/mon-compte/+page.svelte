<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head>
  <title>Mon compte - Espace OFS - BoRiS</title>
</svelte:head>

<div class="fr-grid-row fr-grid-row--center">
  <div class="fr-col-12 fr-col-md-8 fr-col-lg-6">
    <h1 class="fr-h3">Mon compte</h1>

    {#if form?.message}
      <div class="fr-alert fr-alert--error fr-mb-3w">
        <p>{form.message}</p>
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
  </div>
</div>
