<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head>
  <title>Réinitialisation du mot de passe - Espace OFS - BoRiS</title>
</svelte:head>

<h1 class="fr-h3">Réinitialisation du mot de passe</h1>
<p class="fr-text--sm">Choisissez un nouveau mot de passe pour accéder à votre espace.</p>

{#if form?.message}
  <div class="fr-alert fr-alert--error fr-mb-3w">
    <p>{form.message}</p>
    <p><a class="fr-link" href="/mot-de-passe-oublie">Demander un nouveau lien</a></p>
  </div>
{/if}

<form method="POST" class="fr-mt-3w">
  <input type="hidden" name="token" value={form?.token || data.token} />
  <div class="fr-input-group">
    <label class="fr-label" for="password">Nouveau mot de passe</label>
    <input class="fr-input" id="password" name="password" type="password" minlength="12" autocomplete="new-password" required />
    <p class="fr-hint-text">12 caractères minimum.</p>
  </div>
  <div class="fr-mt-3w">
    <button class="fr-btn" type="submit">Réinitialiser le mot de passe</button>
  </div>
</form>
