<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head>
  <title>Double authentification - Espace OFS - BoRiS</title>
</svelte:head>

<p class="fr-text--sm fr-mb-1w">Étape 2 sur 2</p>
<h1 class="fr-h3">Vérifiez votre identité</h1>
<p>Saisissez le code à 6 chiffres de votre application d’authentification.</p>

{#if form?.message}
  <div class="fr-alert fr-alert--error fr-mb-3w" role="alert">
    <p>{form.message}</p>
  </div>
{/if}

<form method="POST" class="fr-mt-3w">
  <input
    type="hidden"
    name="returnTo"
    value={form?.returnTo || data.returnTo || ""}
  />
  <div class="fr-input-group">
    <label class="fr-label" for="code">
      Code de vérification
      <span class="fr-hint-text" id="code-hint"
        >Vous pouvez aussi utiliser l’un de vos codes de récupération à usage
        unique.</span
      >
    </label>
    <input
      class="fr-input"
      id="code"
      name="code"
      type="text"
      autocomplete="one-time-code"
      autocapitalize="none"
      spellcheck="false"
      aria-describedby="code-hint"
      maxlength="64"
      required
    />
  </div>
  <button class="fr-btn fr-mt-2w" type="submit">Vérifier et se connecter</button
  >
</form>

<p class="fr-mt-3w">
  <a class="fr-link" href="/connexion">Recommencer la connexion</a>
</p>
<p class="fr-text--sm">
  Vous avez perdu votre application et vos codes de récupération ? Contactez
  l’administration.
</p>
