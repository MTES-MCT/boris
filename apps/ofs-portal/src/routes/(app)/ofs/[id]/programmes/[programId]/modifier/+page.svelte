<script lang="ts">
  import ProgramForm from "$lib/components/ProgramForm.svelte";
  import { programValues } from "$lib/programs";
  let { data, form } = $props();
</script>

<svelte:head
  ><title>Modifier un programme - {data.ofs.name} - BoRiS</title></svelte:head
>
<h1 class="fr-h3">Modifier le programme</h1>
<p>
  Les modifications seront immédiatement visibles sur la carte pour <strong
    >{data.ofs.name}</strong
  >.
</p>
<ProgramForm
  values={form?.values || programValues(data.program)}
  error={form?.error}
  distributors={data.ofs.distributors}
  backHref={`/ofs/${data.ofs.id}/programmes`}
  submitLabel="Enregistrer les modifications"
/>
