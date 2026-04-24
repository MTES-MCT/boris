<script lang="ts">
  let { form } = $props();
</script>

<svelte:head>
  <title>Mot de passe oublié - Espace OFS - BoRiS</title>
</svelte:head>

<h1 class="fr-h3">Mot de passe oublié</h1>
<p class="fr-text--sm">Saisissez votre adresse email pour recevoir un lien de réinitialisation.</p>

{#if form?.submitted}
  <div class="fr-alert fr-alert--success fr-mb-3w">
    <p>Si cette adresse email correspond à un utilisateur actif, un email de réinitialisation a été envoyé.</p>
  </div>
{/if}

<form method="POST" class="fr-mt-3w">
  <div class="fr-input-group">
    <label class="fr-label" for="email">Adresse email</label>
    <input class="fr-input" id="email" name="email" type="email" value={form?.email || ''} required />
  </div>
  <div class="fr-mt-3w">
    <button class="fr-btn" type="submit">Envoyer le lien</button>
  </div>
</form>
