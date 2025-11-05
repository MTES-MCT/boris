<script lang="ts">
  import type { StepSection } from '$lib/utils/definitions';

  type Props = {
    sections: StepSection[];
    className?: string;
    activeSectionId?: string;
  };

  const { className, sections, activeSectionId }: Props = $props();
</script>

<nav
  class={className}
  id="navigation">
  <ul>
    {#each sections as section}
      <li>
        <a
          href={`#${section.id}`}
          class="fr-link"
          class:active={activeSectionId === section.id}>
          {section.title}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style lang="postcss">
  nav {
    margin-block-start: var(--3w);
    border-bottom: solid 1px var(--color-gray-light);

    ul {
      margin: 0;
      list-style: none;
      padding-block-end: var(--3w);
      padding-inline-start: 0;
    }

    li {
      margin-block: var(--1w);
    }

    a {
      font-weight: 700;
    }
  }

  @media (--sm-viewport) {
    nav {
      position: sticky;
      top: var(--6w);
      margin-block-start: 0;
      padding-inline-end: var(--3w);
      border-right: solid 1px var(--color-gray-light);
      border-bottom: none;

      li {
        margin-block-end: var(--3w);

        &:nth-last-child(1) {
          margin-block-end: 0;
        }
      }

      a {
        position: relative;
        display: block;
        background: none;
        color: black;
        transition: color 0.1s 0.02s;

        &::before {
          content: '';
          position: absolute;
          left: calc(-1 * var(--1w));
          top: 0;
          height: 100%;
          width: 2px;
          background-color: var(--text-active-blue-france);
          opacity: 0;
          transition: opacity 0.2s 0.1s;
        }

        &.active {
          color: var(--text-active-blue-france);

          &::before {
            opacity: 1;
          }
        }
      }
    }
  }

  @media (--md-viewport) {
    nav {
      padding-inline-end: var(--6w);
    }
  }
</style>
