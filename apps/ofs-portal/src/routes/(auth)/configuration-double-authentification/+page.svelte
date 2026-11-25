<script lang="ts">
  import { enhance } from "$app/forms";
  let { data, form } = $props();
  let saved = $state(false);
  let busy = $state(false);
  let copyMessage = $state("");
  let recoveryCodes = $derived(
    form && "recoveryCodes" in form ? form.recoveryCodes : undefined,
  );
  let step = $derived(recoveryCodes ? 3 : data.secret ? 2 : 1);

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      copyMessage = "Copié dans le presse-papiers.";
    } catch {
      copyMessage =
        "Copie impossible. Sélectionnez et copiez le texte affiché.";
    }
  }
  function download() {
    if (!recoveryCodes) return;
    const url = URL.createObjectURL(
      new Blob(
        [
          `BoRiS — Codes de récupération\n${data.email}\n\n${recoveryCodes.join("\n")}\n`,
        ],
        { type: "text/plain;charset=utf-8" },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "boris-codes-recuperation.txt";
    link.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head
  ><title>Double authentification - BoRiS</title><meta
    name="referrer"
    content="no-referrer"
  /></svelte:head
>

<p class="fr-text--sm fr-mt-3w">Étape {step} sur 3 · Sécurité du compte</p>
<h1 class="fr-h4">
  {recoveryCodes
    ? "Conservez vos codes de récupération"
    : data.enabled
      ? "Double authentification activée"
      : "Configurer la double authentification"}
</h1>

{#if form && "message" in form && form.message}
  <div class="fr-alert fr-alert--error fr-mb-3w" role="alert">
    <p>{form.message}</p>
  </div>
{/if}

{#if recoveryCodes}
  <div class="fr-alert fr-alert--success fr-mb-3w">
    <p>Votre double authentification est activée.</p>
  </div>
  <p>
    Ces 10 codes permettent de vous connecter si vous perdez l’accès à votre
    application. Chaque code ne peut être utilisé qu’une fois.
  </p>
  <p>
    <strong>Ils ne seront affichés qu’une seule fois.</strong> Enregistrez-les dans
    un endroit sûr, séparément de votre application, avant de quitter cette page.
  </p>
  <ul class="recovery-codes fr-p-2w">
    {#each recoveryCodes as code}<li><code>{code}</code></li>{/each}
  </ul>
  <div class="fr-btns-group fr-btns-group--inline-md">
    <button
      class="fr-btn fr-btn--secondary"
      onclick={() => copy(recoveryCodes!.join("\n"))}>Copier les codes</button
    >
    <button class="fr-btn fr-btn--secondary" onclick={download}
      >Télécharger les codes</button
    >
  </div>
  <form method="POST" action="?/finish">
    <input type="hidden" name="returnTo" value={data.returnTo} />
    <div class="fr-checkbox-group fr-my-3w">
      <input id="saved" type="checkbox" bind:checked={saved} required /><label
        class="fr-label"
        for="saved">J’ai enregistré mes codes de récupération</label
      >
    </div>
    <button class="fr-btn" disabled={!saved}>Terminer</button>
  </form>
{:else if data.enabled}
  <p>
    Votre compte est protégé. Un code de votre application vous sera demandé à
    chaque connexion.
  </p>
  <a class="fr-btn" href="/mon-compte">Retour à mon compte</a>
{:else if data.secret && data.qrCode}
  <h2 class="fr-h6">Ajoutez BoRiS dans votre application</h2>
  <p>
    Scannez ce QR code avec votre application d’authentification ou votre
    gestionnaire de mots de passe.
  </p>
  <img
    class="qr-code"
    src={data.qrCode}
    alt="QR code de configuration de la double authentification BoRiS"
    width="256"
    height="256"
  />
  <p class="fr-mt-2w">
    Vous pouvez aussi saisir cette clé manuellement, en choisissant un code basé
    sur le temps (TOTP).
  </p>
  <div class="fr-input-group">
    <label class="fr-label" for="setup-key">Clé de configuration</label><input
      class="fr-input setup-key"
      id="setup-key"
      readonly
      value={data.secret}
    />
  </div>
  <button
    class="fr-btn fr-btn--secondary fr-btn--sm"
    onclick={() => copy(data.secret!)}>Copier la clé</button
  >
  <p class="fr-hint-text fr-mt-2w">
    Gardez cette clé confidentielle. La configuration expire après 5 minutes.
  </p>
  <h2 class="fr-h6 fr-mt-4w">Vérifiez le code de votre application</h2>
  <form
    method="POST"
    action={`?/confirm&returnTo=${encodeURIComponent(data.returnTo)}`}
    use:enhance={() => {
      busy = true;
      return async ({ update }) => {
        await update();
        busy = false;
      };
    }}
  >
    <div class="fr-input-group">
      <label class="fr-label" for="code"
        >Code de vérification<span class="fr-hint-text"
          >Les 6 chiffres affichés dans votre application.</span
        ></label
      ><input
        class="fr-input"
        id="code"
        name="code"
        inputmode="numeric"
        autocomplete="one-time-code"
        pattern={"[0-9]{6}"}
        minlength="6"
        maxlength="6"
        required
      />
    </div>
    <button class="fr-btn" disabled={busy}
      >{busy ? "Vérification…" : "Vérifier et activer"}</button
    >
  </form>
  <form method="POST" action="?/cancel" class="fr-mt-2w">
    <button class="fr-btn fr-btn--tertiary">Annuler la configuration</button>
  </form>
{:else}
  <p>
    Ajoutez une protection à votre compte <strong>{data.email}</strong> avec votre
    application d’authentification ou votre gestionnaire de mots de passe.
  </p>
  <p>
    Vous ajouterez une clé, vérifierez un premier code, puis enregistrerez vos
    codes de récupération.
  </p>
  <form
    method="POST"
    action={`?/begin&returnTo=${encodeURIComponent(data.returnTo)}`}
  >
    <div class="fr-input-group">
      <label class="fr-label" for="currentPassword"
        >Confirmez votre mot de passe</label
      ><input
        class="fr-input"
        type="password"
        id="currentPassword"
        name="currentPassword"
        autocomplete="current-password"
        required
      />
    </div>
    <button class="fr-btn">Commencer la configuration</button>
  </form>
  <a class="fr-link fr-mt-3w" href="/mon-compte">Retour à mon compte</a>
{/if}
<p class="fr-text--sm fr-mt-2w" role="status">{copyMessage}</p>

<style>
  .qr-code {
    display: block;
    max-width: 100%;
    height: auto;
    margin-inline: auto;
    background: white;
  }
  .setup-key,
  .recovery-codes {
    font-family: monospace;
  }
  .recovery-codes {
    list-style: none;
    background: var(--background-alt-grey);
    overflow-wrap: anywhere;
    font-size: 0.875rem;
  }
  .recovery-codes li {
    padding-block: 0.25rem;
  }
</style>
