<script lang="ts">
  import { default as MascotteWaving } from '$assets/icons/mascotte-waving.svg?raw';

  type Props = {
    content: string;
  };

  const { content }: Props = $props();
</script>

<div class="disclaimer relative text-center fr-pt-13v">
  <div class="mascotte absolute">
    {@html MascotteWaving}
  </div>
  <p
    class="background-color-red-primary inline-block fr-m-0 fr-px-2w fr-py-1w font-size-2">
    <span class="fr-text--bold">B</span>
    <span>o</span>
    <span class="fr-text--bold">R</span>
    <span>i</span>
    <span class="fr-text--bold">S</span>
  </p>

  <p class="fr-h2 fr-m-0">{content}</p>
</div>

<style lang="postcss">
  .mascotte {
    width: 82px;
    top: 0px;
    left: 50%;
  }
</style>
