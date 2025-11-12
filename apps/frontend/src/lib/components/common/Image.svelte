<script lang="ts">
  import Img from '@zerodevx/svelte-img';
  import Photograph from '$components/common/Photograph.svelte';
  import type { ComponentProps } from 'svelte';

  type Props = {
    image: string;
    photograph?: string;
    photographPosition?: ComponentProps<typeof Photograph>['position'];
  };

  const {
    image,
    photograph,
    photographPosition = 'bottom-right',
  }: Props = $props();
</script>

<div>
  <Img
    class="fr-responsive-img"
    src={image}
    alt="" />
  {#if photograph}
    <Photograph
      position={photographPosition}
      {photograph} />
  {/if}
</div>

<style lang="postcss">
  div {
    height: 100%;

    :global(img) {
      height: 100%;
      object-fit: cover;
    }

    :global(picture) {
      width: 100%;
    }
  }
</style>
