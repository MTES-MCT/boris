<script lang="ts">
  import Section from '$lib/components/section/section.svelte';
  import Accordion from '$lib/components/accordion/accordion.svelte';
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

  <div class="fr-accordions-group">
    <Accordion label="Bretagne">
      <div class="fr-accordions-group">
        <Accordion label="Morbihan">Bonjour</Accordion>
      </div>
    </Accordion>
  </div>
</Section>
