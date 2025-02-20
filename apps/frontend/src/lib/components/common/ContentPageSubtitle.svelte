<script lang="ts">
  type Props = {
    title: string;
  };

  const { title }: Props = $props();
</script>

<h2 class="fr-h5">{title}</h2>

<style lang="postcss">
  h2 {
    margin-block-start: var(--5w);
    margin-block-end: var(--2w);
  }
</style>
