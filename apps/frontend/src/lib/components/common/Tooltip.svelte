<script lang="ts">
  import '@gouvfr/dsfr/dist/component/tooltip/tooltip.min.css';

  import { type Snippet } from 'svelte';
  import { nanoid } from 'nanoid';

  import dsfrManager from '$lib/managers/dsfr.svelte';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
  const id = nanoid(10);

  $effect(() => {
    if (dsfrManager.isWindowDsfrDefined) {
      // @ts-expect-error: no declaration file
      import('@gouvfr/dsfr/dist/component/tooltip/tooltip.module.min.js');
    }
  });
</script>

<span
  aria-describedby={id}
  class="fr-link cursor-pointer">
  <span class="fr-icon-question-line fr-icon--sm"></span>
</span>
<div
  class="fr-tooltip fr-placement"
  {id}
  role="tooltip">
  {@render children()}
</div>
