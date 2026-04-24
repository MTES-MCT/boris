<script lang="ts">
  let { data, form } = $props();

  const values = $derived(
    form?.values || {
      name: data.ofs.name,
      email: data.ofs.email || '',
      phone: data.ofs.phone || '',
      websiteUrl: data.ofs.websiteUrl || '',
    },
  );
</script>

<svelte:head>
  <title>{data.ofs.name} - Profil - Espace OFS - BoRiS</title>
</svelte:head>

<h1 class="fr-h3">Profil</h1>
<p class="fr-text--sm">Mettez à jour les informations publiques affichées pour cet OFS.</p>

{#if form?.error}
  <div class="fr-alert fr-alert--error fr-mb-3w">
    <p>{form.error}</p>
  </div>
{/if}

<div class="fr-grid-row fr-grid-row--gutters">
  <div class="fr-col-12 fr-col-lg-7">
    <section class="fr-p-3w fr-mb-3w" style="background: white; border-radius: 0.5rem;">
      <h2 class="fr-h5">Informations publiques</h2>
      <form method="POST">
        <div class="fr-input-group">
          <label class="fr-label" for="name">Nom</label>
          <input class="fr-input" id="name" name="name" type="text" required value={values.name} />
        </div>
        <div class="fr-input-group">
          <label class="fr-label" for="email">Adresse email</label>
          <input class="fr-input" id="email" name="email" type="email" value={values.email} />
        </div>
        <div class="fr-input-group">
          <label class="fr-label" for="phone">Téléphone</label>
          <input class="fr-input" id="phone" name="phone" type="text" value={values.phone} />
        </div>
        <div class="fr-input-group">
          <label class="fr-label" for="websiteUrl">Site web</label>
          <input class="fr-input" id="websiteUrl" name="websiteUrl" type="url" pattern="https?://.+" value={values.websiteUrl} />
          <p class="fr-hint-text">Veuillez entrer une URL valide commençant par http:// ou https://</p>
        </div>
        <div class="fr-mt-3w">
          <button class="fr-btn" type="submit">Enregistrer</button>
        </div>
      </form>
    </section>
  </div>

  <div class="fr-col-12 fr-col-lg-5">
    <section class="fr-p-3w fr-mb-3w" style="background: white; border-radius: 0.5rem;">
      <h2 class="fr-h5">Informations de rattachement</h2>
      <p class="fr-text--sm">Mis à jour le {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(data.ofs.updatedAt))}</p>
      {#if data.ofs.websiteUrl}
        <p><a class="fr-link" href={data.ofs.websiteUrl} target="_blank" rel="noopener noreferrer">Consulter le site web</a></p>
      {/if}
      <h3 class="fr-h6 fr-mt-3w">Régions</h3>
      {#if data.ofs.regions.length}
        <ul class="fr-tags-group">{#each data.ofs.regions as region}<li><p class="fr-tag">{region.name}</p></li>{/each}</ul>
      {:else}<p>Aucun</p>{/if}
      <h3 class="fr-h6 fr-mt-3w">Départements</h3>
      {#if data.ofs.departements.length}
        <ul class="fr-tags-group">{#each data.ofs.departements as departement}<li><p class="fr-tag">{departement.name}</p></li>{/each}</ul>
      {:else}<p>Aucun</p>{/if}
      <h3 class="fr-h6 fr-mt-3w">Commercialisateurs</h3>
      {#if data.ofs.distributors.length}
        <ul class="fr-tags-group">{#each data.ofs.distributors as distributor}<li><p class="fr-tag">{distributor.name}</p></li>{/each}</ul>
      {:else}<p>Aucun</p>{/if}
    </section>
  </div>
</div>
