<script lang="ts">
  import { default as MascotteWaving } from '$assets/icons/mascotte-waving.svg?raw';

  type Props = {
    content: string;
  };

  const { content }: Props = $props();
</script>

<div class="relative text-center pt-[51px]">
  <div class="absolute top-0 left-1/2">
    {@html MascotteWaving}
  </div>
  <p class="inline-block fr-h2 fr-py-1w fr-px-2w fr-m-0 bg-red-primary">
    <span>B</span>
    <span class="fr-text--regular">o</span>
    <span>R</span>
    <span class="fr-text--regular">i</span>
    <span>S</span>
  </p>

  <p class="fr-h3 fr-mt-1">{content}</p>
</div>
