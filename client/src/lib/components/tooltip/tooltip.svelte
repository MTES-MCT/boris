<script lang="ts">
  import { nanoid } from 'nanoid';
  import type { Props } from './definitions';

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
