<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
</script>

<section
  class="fr-container flex flex-column gap-8w md_gap-0 fr-mt-8w fr-mb-0 fr-mt-md-15w fr-mb-md-10w">
  {@render children()}
</section>
