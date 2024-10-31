<script lang="ts">
  import Section from '$lib/components/section/section.svelte';
  import Accordion from '$lib/components/accordion/accordion.svelte';
  import type { Props } from './definitions';

  const { data }: Props = $props();
  const { regions } = data;
</script>

<Section
  title="Organismes fonciers solidaires"
  titleElement="h1">
  <div class="fr-accordions-group">
    {#each regions as region}
      <Accordion label={region.name}>
        <div class="fr-accordions-group">
          {#each region.departements as departement}
            <Accordion label={departement.name}>
              <ul>
                {#each departement.OFSs as ofs}
                  <li>
                    {ofs.nom}
                  </li>
                {/each}
              </ul>
            </Accordion>
          {/each}
        </div>
      </Accordion>
    {/each}
  </div>
</Section>
