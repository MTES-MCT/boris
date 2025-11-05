<script lang="ts">
  import '@gouvfr/dsfr/dist/component/tooltip/tooltip.min.css';

  import { onMount, type Snippet } from 'svelte';
  import { nanoid } from 'nanoid';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/component/tooltip/tooltip.module.min.js');
  });

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
  const id = nanoid(10);
</script>

<a
  aria-describedby={id}
  aria-label="infobulle"
  href="#"
  class="fr-link !bg-none">
  <span class="fr-icon-question-line fr-icon--sm"></span>
</a>
<div
  class="fr-tooltip fr-placement"
  {id}
  role="tooltip">
  {@render children()}
</div>
