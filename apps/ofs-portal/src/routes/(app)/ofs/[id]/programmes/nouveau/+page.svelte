<script lang="ts">
  import ProgramForm from "$lib/components/ProgramForm.svelte";
  import { programValues } from "$lib/programs";
  let { data, form } = $props();
</script>

<svelte:head
  ><title>Ajouter un programme - {data.ofs.name} - BoRiS</title></svelte:head
>
<h1 class="fr-h3">Ajouter un programme</h1>
<p>
  Ce programme sera rattaché à <strong>{data.ofs.name}</strong> et publié immédiatement
  sur la carte.
</p>
<ProgramForm
  values={form?.values || programValues()}
  error={form?.error}
  distributors={data.ofs.distributors}
  backHref={`/ofs/${data.ofs.id}/programmes`}
  submitLabel="Ajouter le programme"
/>
