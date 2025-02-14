<script lang="ts">
  import '@gouvfr/dsfr/dist/component/tooltip/tooltip.min.css';
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';
  import { onMount, type Snippet } from 'svelte';
  import { nanoid } from 'nanoid';

  onMount(async () => {
    await import(
      // @ts-expect-error: no declaration file
      '@gouvfr/dsfr/dist/component/tooltip/tooltip.module.min'
    );
  });

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
  const id = nanoid(10);
</script>

<span
  class="fr-icon-question-line"
  aria-hidden="true"
  aria-describedby={id}>
</span>
<span
  class="fr-tooltip fr-placement"
  {id}
  role="tooltip"
  aria-hidden="true">
  {@render children()}
</span>

<style>
  .fr-icon-question-line {
    color: var(--text-action-high-blue-france);
    cursor: pointer;

    &::before {
      --icon-size: var(--2w);
    }
  }

  .fr-tooltip {
    text-align: center;
  }
</style>
