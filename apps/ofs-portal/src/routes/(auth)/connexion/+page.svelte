<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head>
  <title>Connexion - Espace OFS - BoRiS</title>
</svelte:head>

<h1 class="fr-h3">Connexion</h1>
<p class="fr-text--sm">Connectez-vous pour accéder à votre espace OFS.</p>

{#if data.resetSuccess}
  <div class="fr-alert fr-alert--success fr-mb-3w">
    <p>Votre mot de passe a été réinitialisé. Vous pouvez vous connecter.</p>
  </div>
{/if}

{#if form?.message}
  <div class="fr-alert fr-alert--error fr-mb-3w">
    <p>{form.message}</p>
  </div>
{/if}

<form method="POST" class="fr-mt-3w">
  <input type="hidden" name="returnTo" value={form?.returnTo || data.returnTo || ''} />
  <div class="fr-input-group">
    <label class="fr-label" for="email">Adresse email</label>
    <input class="fr-input" id="email" name="email" type="email" autocomplete="username" value={form?.email || ''} required />
  </div>
  <div class="fr-input-group">
    <label class="fr-label" for="password">Mot de passe</label>
    <input class="fr-input" id="password" name="password" type="password" autocomplete="current-password" required />
  </div>
  <div class="fr-mt-3w">
    <button class="fr-btn" type="submit">Connexion</button>
  </div>
</form>

<p class="fr-mt-3w">
  <a class="fr-link" href="/mot-de-passe-oublie">Mot de passe oublié</a>
</p>
