<script lang="ts">
  import { onMount } from "svelte";
  import { enhance } from "$app/forms";
  import { page } from "$app/state";
  let { data, form } = $props();
  let copied = $state(false);
  let copyError = $state(false);
  let creating = $state(false);
  let ready = $state(false);
  onMount(() => {
    ready = true;
  });
  const isDistributor = $derived(
    data.user?.roles.includes("commercialisateur"),
  );
  const ofsId = $derived(
    page.data.currentOfs?.id || data.user?.ofss?.[0]?.id || "VOTRE_OFS_ID",
  );
  const example = $derived(
    `curl '${data.apiUrl}?${isDistributor ? "" : `ofsId=${ofsId}&`}page=1&pageSize=20' \\\n  -H 'Authorization: Bearer VOTRE_CLE_API'`,
  );
  const responseExample = `{
  "items": [{
    "simulationId": "uuid", "locationId": "uuid", "ofsId": "uuid",
    "submittedAt": "2026-11-26T09:00:00.000Z",
    "fullName": "Camille Martin", "email": "camille@example.com",
    "phone": null, "city": "Lyon", "inseeCode": "69123",
    "departementCode": "69", "householdSize": 2,
    "hasDisability": false, "contribution": 10000,
    "taxableIncome": 28000, "resources": 2400,
    "propertySituation": "LOCATAIRE_PRIVE", "housingType": null,
    "action": null, "status": null
  }],
  "totalCount": 1, "page": 1, "pageSize": 20, "pagesCount": 1,
  "hasPreviousPage": false, "hasNextPage": false
}`;
  function date(value: string) {
    return new Date(value).toLocaleString("fr-FR");
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(form!.created!.token);
      copied = true;
      copyError = false;
    } catch {
      copyError = true;
    }
  }
</script>

<svelte:head><title>Accès API - BoRiS</title></svelte:head>
<a class="fr-link fr-icon-arrow-left-line fr-link--icon-left" href="/mon-compte"
  >Mon compte</a
>
<h1 class="fr-mt-3w">Accès API</h1>
<p class="fr-text--lead">Connectez vos outils à vos contacts BoRiS.</p>
<p>
  Vos clés donnent accès en lecture seule aux contacts visibles par votre
  compte. Les droits sont vérifiés à chaque appel. Conservez vos clés dans un
  endroit sûr et ne les partagez pas.
</p>

{#if form?.message}<div class="fr-alert fr-alert--error fr-mb-3w" role="alert">
    <p>{form.message}</p>
  </div>{/if}
{#if form?.removed}<div
    class="fr-alert fr-alert--success fr-mb-3w"
    role="status"
  >
    <p>Clé supprimée. Elle ne peut plus être utilisée.</p>
  </div>{/if}
{#if form?.created}
  <section class="fr-callout fr-mb-4w" aria-labelledby="new-key-title">
    <h2 id="new-key-title" class="fr-h4">Copiez votre clé maintenant</h2>
    <p>
      Cette clé ne sera plus affichée après avoir quitté ou actualisé cette
      page. Si vous la perdez, supprimez-la et créez-en une nouvelle.
    </p>
    <label class="fr-label" for="new-key">Clé API : {form.created.name}</label>
    <input
      id="new-key"
      class="fr-input fr-mb-2w font-mono"
      value={form.created.token}
      readonly
      autocomplete="off"
      spellcheck="false"
    />
    <button type="button" class="fr-btn fr-btn--secondary" onclick={copy}
      >{copied ? "Clé copiée" : "Copier la clé"}</button
    >
    <span role="status"
      >{copyError
        ? "La copie a échoué. Sélectionnez et copiez la clé manuellement."
        : copied
          ? "Copie effectuée."
          : ""}</span
    >
    <a class="fr-link fr-ml-2w" href="/acces-api">J’ai enregistré ma clé</a>
  </section>
{/if}

<section aria-labelledby="keys-title" class="fr-mb-6w">
  <h2 id="keys-title">Mes clés API</h2>
  <form
    method="POST"
    action="?/create"
    use:enhance={() => {
      creating = true;
      copied = false;
      return async ({ update }) => {
        await update();
        creating = false;
      };
    }}
    class="fr-mb-3w"
  >
    <div class="fr-input-group">
      <label class="fr-label" for="key-name"
        >Nom de la clé <span class="fr-hint-text"
          >Par exemple : synchronisation CRM. 100 caractères maximum.</span
        ></label
      >
      <input
        id="key-name"
        class="fr-input"
        name="name"
        required
        maxlength="100"
      />
    </div>
    <button class="fr-btn" disabled={creating || !ready}
      >{creating ? "Création…" : "Créer une clé API"}</button
    >
  </form>
  <noscript
    ><p>
      Activez JavaScript pour créer une clé et l’afficher une seule fois.
    </p></noscript
  >
  {#if data.keys.length === 0}<p>
      Aucune clé API. Créez votre première clé pour commencer.
    </p>
  {:else}
    <div class="fr-table">
      <table>
        <caption class="fr-sr-only">Clés API de votre compte</caption>
        <thead
          ><tr
            ><th scope="col">Nom</th><th scope="col">Clé masquée</th><th
              scope="col">Création</th
            ><th scope="col">Dernière utilisation</th><th scope="col">Action</th
            ></tr
          ></thead
        >
        <tbody
          >{#each data.keys as key (key.id)}<tr>
              <td>{key.name}</td><td
                ><code class="[overflow-wrap:anywhere]">{key.prefix}…</code></td
              ><td>{date(key.createdAt)}</td><td
                >{key.lastUsedAt ? date(key.lastUsedAt) : "Jamais utilisée"}</td
              >
              <td
                ><form
                  method="POST"
                  action="?/remove"
                  use:enhance={({ cancel }) => {
                    if (
                      !confirm(
                        `Supprimer la clé « ${key.name} » ? Les outils qui l’utilisent perdront immédiatement leur accès.`,
                      )
                    )
                      cancel();
                  }}
                >
                  <input type="hidden" name="id" value={key.id} /><button
                    class="fr-btn fr-btn--tertiary fr-btn--sm"
                    aria-label={`Supprimer la clé ${key.name}`}
                    >Supprimer</button
                  >
                </form></td
              >
            </tr>{/each}</tbody
        >
      </table>
    </div>
  {/if}
</section>

<section aria-labelledby="docs-title">
  <h2 id="docs-title">Documentation · Contacts v1</h2>
  <p><code class="[overflow-wrap:anywhere]">GET {data.apiUrl}</code></p>
  <p>
    Envoyez votre clé dans l’en-tête <code
      >Authorization: Bearer VOTRE_CLE_API</code
    >. Seul cet endpoint en lecture est accessible avec ces clés. Elles ne
    permettent ni de modifier des contacts, ni d’accéder aux autres API BoRiS.
  </p>
  <h3 class="fr-h5">Paramètres</h3>
  <ul>
    <li>
      <code class="[overflow-wrap:anywhere]">ofsId</code> : UUID de l’OFS, obligatoire
      pour les comptes OFS et administrateurs. Pour les commercialisateurs, facultatif
      pour filtrer un OFS parmi les transmissions actives.
    </li>
    <li>
      <code class="[overflow-wrap:anywhere]">page</code> : numéro de page à partir
      de 1 (défaut : 1).
    </li>
    <li>
      <code class="[overflow-wrap:anywhere]">pageSize</code> : nombre de lignes,
      entre 1 et 150 (défaut : 150).
    </li>
  </ul>
  <p>
    Une ligne correspond à une simulation et une localisation, pour un OFS. Un
    contact peut donc apparaître plusieurs fois. Utilisez le triplet <code
      >ofsId</code
    >, <code class="[overflow-wrap:anywhere]">simulationId</code>,
    <code class="[overflow-wrap:anywhere]">locationId</code>
    comme identifiant. Les lignes sont triées de la plus récente à la plus
    ancienne. Continuez tant que
    <code class="[overflow-wrap:anywhere]">hasNextPage</code>
    vaut <code class="[overflow-wrap:anywhere]">true</code>. Les données
    évoluent : une pagination n’est pas un instantané.
  </p>
  <h3 class="fr-h5">Exemple d’appel</h3>
  <pre class="overflow-x-auto bg-[var(--background-alt-grey)] p-4 text-sm"><code
      class="[overflow-wrap:anywhere]">{example}</code
    ></pre>
  <h3 class="fr-h5">Réponse JSON</h3>
  <pre class="overflow-x-auto bg-[var(--background-alt-grey)] p-4 text-sm"><code
      class="[overflow-wrap:anywhere]">{responseExample}</code
    ></pre>
  <p>
    Les identifiants sont des UUID et <code class="[overflow-wrap:anywhere]"
      >submittedAt</code
    >
    est une date ISO 8601 en UTC. Les champs du contact peuvent être
    <code class="[overflow-wrap:anywhere]">null</code>.
    <code class="[overflow-wrap:anywhere]">householdSize</code>
    est un nombre, <code class="[overflow-wrap:anywhere]">hasDisability</code>
    un booléen ;
    <code class="[overflow-wrap:anywhere]">contribution</code>,
    <code class="[overflow-wrap:anywhere]">taxableIncome</code>
    et
    <code class="[overflow-wrap:anywhere]">resources</code>
    sont des montants en euros.
    <code class="[overflow-wrap:anywhere]">propertySituation</code>
    et
    <code class="[overflow-wrap:anywhere]">housingType</code>
    sont des codes métier ; <code class="[overflow-wrap:anywhere]">action</code>
    et <code class="[overflow-wrap:anywhere]">status</code> sont les valeurs du suivi
    de votre organisation. Les autres champs du contact sont des chaînes.
  </p>
  <p>
    <code class="[overflow-wrap:anywhere]">totalCount</code> compte les lignes,
    <code class="[overflow-wrap:anywhere]">pagesCount</code>
    les pages. Une absence de contacts renvoie
    <code class="[overflow-wrap:anywhere]">items: []</code>. Limite : 120 appels
    par minute et par clé. Le dernier usage est mis à jour après un appel
    autorisé réussi.
  </p>
  <ul>
    <li>
      <code class="[overflow-wrap:anywhere]">400</code> : paramètres invalides
      ou <code class="[overflow-wrap:anywhere]">ofsId</code> manquant.
    </li>
    <li>
      <code class="[overflow-wrap:anywhere]">401</code> : clé absente, invalide,
      supprimée ou compte désactivé.
    </li>
    <li>
      <code class="[overflow-wrap:anywhere]">404</code> : OFS inaccessible ou inexistant
      (comptes OFS et administrateurs).
    </li>
    <li>
      <code class="[overflow-wrap:anywhere]">429</code> : trop d’appels ; attendez
      une minute avant de réessayer.
    </li>
  </ul>
  <p>
    Les droits suivent votre compte : un changement de rattachement OFS ou de
    transmission commerciale s’applique aux prochains appels. La suppression
    d’une clé bloque ses prochains appels.
  </p>
</section>
