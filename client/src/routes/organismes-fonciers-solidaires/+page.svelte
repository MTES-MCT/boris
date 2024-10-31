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
      {@const regionLabel = `${region.name} (${region.totalOFSs})`}

      <Accordion label={regionLabel}>
        <div class="fr-accordions-group">
          {#each region.departements as departement}
            {@const departementLabel = `${departement.name} (${departement.totalOFSs})`}

            <Accordion label={departementLabel}>
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
