<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.min.css';
  import { type Snippet } from 'svelte';
  import { nanoid } from 'nanoid';

  type Props = {
    children: Snippet;
  };

  const { children }: Props = $props();
  const id = nanoid(10);
</script>

<div class="tooltip">
  <span
    class="fr-icon-question-line"
    aria-describedby={id}>
  </span>
  <div
    class="tooltip-content fr-text--xs"
    {id}
    role="tooltip"
    aria-hidden="true">
    {@render children()}
  </div>
</div>

<style>
  .fr-icon-question-line {
    color: var(--text-action-high-blue-france);

    &::before {
      --icon-size: var(--2w);
    }
  }

  .tooltip {
    position: relative;
    cursor: pointer;
    color: var(--text-title-grey);
  }

  .tooltip .tooltip-content {
    position: absolute;
    bottom: var(--1w);
    transform: translateX(calc(-50% - var(--1w) - var(--1v)));
    background: white;
    z-index: 10;
    display: inline;
    width: max-content;
    max-width: 300px;
    box-shadow: 0 6px 12px rgba(134, 144, 162, 0.3);
    display: none;

    &::after {
      content: '';
      position: absolute;
      bottom: calc(-1 * var(--1w));
      left: calc(50% - var(--1v));
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: var(--1w) var(--1w) 0 var(--1w);
      border-color: white transparent transparent transparent;
    }
  }

  .tooltip:hover {
    .tooltip-content {
      display: inline;
    }
  }
</style>
