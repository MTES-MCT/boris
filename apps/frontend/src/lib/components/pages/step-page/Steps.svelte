<script lang="ts">
  import Card from '$components/pages/step-page/Step.svelte';

  import type { Step } from '$lib/utils/definitions';

  type Props = {
    steps: Step[];
  };

  const { steps }: Props = $props();
</script>

<section class="fr-container">
  {#each steps as { title, description }, index}
    <Card
      {title}
      linkLabel="Tout savoir sur le BRS"
      href={`/tout-savoir-sur-le-bail-reel-solidaire-brs/${steps[0].slug}`}
      position={index + 1}
      isLast={index === steps.length - 1}>
      {@html description}
    </Card>
  {/each}
</section>

<style lang="postcss">
  section {
    display: flex;
    flex-direction: column;
    gap: var(--8w);
    margin-block-start: var(--8w);

    @media (--md-viewport) {
      gap: 0;
      margin-block-start: var(--15w);
      margin-block-end: var(--10w);
    }
  }
</style>
