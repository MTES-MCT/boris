<script lang="ts">
  let { data, form } = $props();
</script>

<svelte:head
  ><title>Supprimer un programme - {data.ofs.name} - BoRiS</title></svelte:head
>
<h1 class="fr-h3">Supprimer le programme</h1>
{#if form?.error}<div class="fr-alert fr-alert--error fr-mb-3w">
    <p>{form.error}</p>
  </div>{/if}
<section class="fr-p-3w" style="background: white; border-radius: 0.5rem;">
  <h2 class="fr-h5">{data.program.programName || "Programme sans nom"}</h2>
  <p>{data.program.address}, {data.program.zipcode} {data.program.city}</p>
  <p>
    Ce programme disparaîtra de la carte publique et de la liste des programmes
    de {data.ofs.name}.
  </p>
  <form method="POST">
    <ul class="fr-btns-group fr-btns-group--inline-md">
      <li>
        <button class="fr-btn" type="submit">Confirmer la suppression</button>
      </li>
      <li>
        <a
          class="fr-btn fr-btn--secondary"
          href={`/ofs/${data.ofs.id}/programmes`}>Annuler</a
        >
      </li>
    </ul>
  </form>
</section>
