<script lang="ts">
  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Pagination from '$components/common/Pagination.svelte';
  import Section from '$components/common/Section.svelte';
  import Card from '$components/pages/annuaire/Card.svelte';
  import type { DataType } from './+page.server';

  type Props = {
    data: DataType;
  };

  const { data }: Props = $props();
</script>

<GradientBackgroundWrapper>
  <Section title="Annuaire des sites de diffusion du BRS">
    <Pagination
      {...data.brsDiffusionWebsites}
      baseUrl="/annuaire" />

    <div class="fr-container--fluid">
      <div class="fr-grid-row fr-grid-row--gutters">
        {#each data.brsDiffusionWebsites.items as item}
          <div class="fr-col-12 fr-col-md-6">
            <Card {...item} />
          </div>
        {/each}
      </div>
    </div>
  </Section>
</GradientBackgroundWrapper>
