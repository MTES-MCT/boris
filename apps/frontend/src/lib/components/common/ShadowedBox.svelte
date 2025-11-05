<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    hidePath?: boolean;
    children: Snippet;
  };

  const { children, hidePath = false }: Props = $props();
</script>

<section
  class="fr-container"
  id="plafonds-de-ressources">
  <div
    class={`
      relative max-w-[588px] mx-auto mt-30 mb-20
      before:content-[''] before:absolute before:bottom-[100%] before:left-1/2 before:h-30 before:w-(--path-thickness) before:bg-blue-primary
    `}
    class:before:hidden={hidePath}>
    <div
      class="blue-overlay hidden md:block absolute w-full max-w-[588px] h-full bottom-[24px] right-[24px] z-[1] rounded-box-lg bg-teal-light">
    </div>

    <div class="relative p-6 z-[2] rounded-box-lg bg-white">
      {@render children()}
    </div>
  </div>
</section>
