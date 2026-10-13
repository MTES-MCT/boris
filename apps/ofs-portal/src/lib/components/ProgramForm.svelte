<script lang="ts">
  import type { ProgramValues } from "$lib/programs";
  let {
    values,
    error,
    distributors,
    backHref,
    submitLabel,
  }: {
    values: ProgramValues;
    error?: string;
    distributors: { id: string; name: string }[];
    backHref: string;
    submitLabel: string;
  } = $props();
</script>

{#if error}
  <div class="fr-alert fr-alert--error fr-mb-3w" role="alert">
    <p>{error}</p>
  </div>
{/if}

<section class="program-form fr-p-3w">
  <p class="fr-text--sm">
    Les champs marqués d’un astérisque (*) sont obligatoires.
  </p>
  <form method="POST">
    <div class="fr-input-group">
      <label class="fr-label" for="programName">Nom du programme *</label>
      <input
        class="fr-input"
        id="programName"
        name="programName"
        type="text"
        required
        value={values.programName}
      />
    </div>
    <div class="fr-input-group">
      <label class="fr-label" for="source"
        >Lien vers le programme *<span class="fr-hint-text"
          >Adresse de l’annonce, commençant par https:// ou http://</span
        ></label
      >
      <input
        class="fr-input"
        id="source"
        name="source"
        type="url"
        pattern="https?://.+"
        required
        value={values.source}
      />
    </div>
    <h2 class="fr-h5 fr-mt-4w">Localisation</h2>
    <p class="fr-text--sm">
      L’adresse permet de placer automatiquement le programme sur la carte.
    </p>
    <div class="fr-input-group">
      <label class="fr-label" for="address"
        >Adresse *<span class="fr-hint-text">Numéro et nom de la voie</span
        ></label
      >
      <input
        class="fr-input"
        id="address"
        name="address"
        type="text"
        required
        value={values.address}
      />
    </div>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-8">
        <div class="fr-input-group">
          <label class="fr-label" for="city">Ville *</label>
          <input
            class="fr-input"
            id="city"
            name="city"
            type="text"
            required
            value={values.city}
          />
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <div class="fr-input-group">
          <label class="fr-label" for="inseeCode"
            >Code INSEE<span class="fr-hint-text"
              >Facultatif, pour préciser la commune</span
            ></label
          >
          <input
            class="fr-input"
            id="inseeCode"
            name="inseeCode"
            type="text"
            maxlength="5"
            pattern={"[0-9][0-9ABab][0-9]{3}"}
            value={values.inseeCode}
          />
        </div>
      </div>
    </div>
    <h2 class="fr-h5 fr-mt-4w">Informations du programme</h2>
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12 fr-col-md-6">
        <div class="fr-select-group">
          <label class="fr-label" for="housingType">Type de logement *</label>
          <select
            class="fr-select"
            id="housingType"
            name="housingType"
            required
            value={values.housingType}
          >
            <option value="new">Neuf</option><option value="old">Ancien</option>
          </select>
        </div>
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <div class="fr-input-group">
          <label class="fr-label" for="deliveryMonth"
            >Mois de livraison<span class="fr-hint-text">Facultatif</span
            ></label
          >
          <input
            class="fr-input"
            id="deliveryMonth"
            name="deliveryMonth"
            type="month"
            value={values.deliveryMonth}
          />
        </div>
      </div>
    </div>
    <div class="fr-select-group">
      <label class="fr-label" for="distributorId"
        >Commercialisateur<span class="fr-hint-text"
          >Facultatif, parmi les commercialisateurs rattachés à votre OFS</span
        ></label
      >
      <select
        class="fr-select"
        id="distributorId"
        name="distributorId"
        value={values.distributorId}
      >
        <option value="">Aucun commercialisateur</option>
        {#if values.distributorId && !distributors.some((item) => item.id === values.distributorId)}
          <option value={values.distributorId} disabled
            >Commercialisateur non rattaché — choisissez une autre option</option
          >
        {/if}
        {#each distributors as distributor}<option value={distributor.id}
            >{distributor.name}</option
          >{/each}
      </select>
    </div>
    {#if !distributors.length}<p class="fr-hint-text">
        Aucun commercialisateur n’est actuellement rattaché à cet OFS.
      </p>{/if}
    <ul class="fr-btns-group fr-btns-group--inline-md fr-mt-4w">
      <li><button class="fr-btn" type="submit">{submitLabel}</button></li>
      <li><a class="fr-btn fr-btn--secondary" href={backHref}>Annuler</a></li>
    </ul>
  </form>
</section>

<style>
  .program-form {
    max-width: 52rem;
    background: white;
    border-radius: 0.5rem;
  }
</style>
