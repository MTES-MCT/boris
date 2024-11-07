<script lang="ts">
  import Section from '$components/section/section.svelte';
  import Accordion from '$components/accordion/accordion.svelte';
  import type { Props } from './definitions';

  const { data }: Props = $props();
  const { regions } = data;
</script>

<Section
  title="Organismes fonciers solidaires"
  titleElement="h1">
  <p>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla modi laborum
    impedit excepturi unde facere. Magni explicabo fuga pariatur quia sint quam
    nulla, asperiores quaerat, eaque ratione odio, velit fugit! Lorem ipsum
    dolor sit amet consectetur adipisicing elit. Laboriosam consequatur sapiente
    esse architecto fugit maxime repellat? Tempora porro sed nostrum, nihil
    recusandae quisquam ipsum, quo quia ullam, dicta distinctio totam.
  </p>
  <p>
    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dolores id
    accusantium architecto? Atque, maiores? Commodi nobis facilis ex, facere
    exercitationem nesciunt consequatur fugit veritatis fugiat magni cum
    perspiciatis provident sunt!
  </p>
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
