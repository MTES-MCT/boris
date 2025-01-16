<script lang="ts">
  import '@gouvfr/dsfr/dist/component/accordion/accordion.min.css';
  import type { Heading } from '$lib/utils/definitions';
  import { nanoid } from 'nanoid';
  import type { Snippet } from 'svelte';

  type Props = {
    label: string;
    labelElement?: Heading;
    children: Snippet;
  };

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
