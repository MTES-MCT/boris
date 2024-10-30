<script lang="ts">
  import Section from '$lib/components/section/section.svelte';
  import type { Props } from './definitions';

  const { data }: Props = $props();
  const { ofsList } = data;
</script>

<Section
  title="Organismes fonciers solidaires"
  titleElement="h1">
  <ul>
    {#each ofsList as ofs}
      <li>{ofs.nom}, {ofs.region}, {ofs.departements}, {ofs.lien}</li>
    {/each}
  </ul>
</Section>
