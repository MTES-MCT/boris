<script lang="ts">
  import type { Props } from '$components/accordion/definitions';
  import { nanoid } from 'nanoid';

  const { label, labelElement = 'h3', children }: Props = $props();
  const id = nanoid(10);
</script>

<section class="fr-accordion">
  <svelte:element
    this={labelElement}
    class="fr-accordion__title">
    <button
      class="fr-accordion__btn"
      aria-expanded="false"
      aria-controls={id}>
      {label}
    </button>
  </svelte:element>
  <div
    class="fr-collapse"
    {id}>
    {@render children()}
  </div>
</section>
