<script lang="ts">
  import { onMount } from 'svelte';
  import Step from '$components/pages/tout-savoir-sur-le-bail-reel-solidaire-brs/(etapes)/Step.svelte';
  import type { StepSection } from '$lib/utils/definitions';
  import Section from '$components/common/Section.svelte';

  type Props = {
    title: string;
    sections: StepSection[];
  };

  type ObservableSection = {
    id: string;
    isVisible: boolean;
  };

  const { title, sections }: Props = $props();

  let observableSections = $state<ObservableSection[]>(
    sections.map((section) => ({
      id: section.id,
      isVisible: true,
    })),
  );

  let activeSection = $derived(
    observableSections.find((section) => section.isVisible),
  );

  onMount(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.5;

        const index = observableSections.findIndex(
          (section) => section.id === id,
        );
        observableSections[index].isVisible = isVisible;
      });
    };

    const observer = new IntersectionObserver(callback, options);

    sections.forEach((section) => {
      const element = document.getElementById(section.id) as Element;
      observer.observe(element);
    });
  });
</script>

<Section>
  <div class="wrapper">
    <div class="fr-grid-row">
      <aside class="fr-col-12 fr-col-sm-3 fr-hidden fr-unhidden-md">
        {@render nav(sections, '')}
      </aside>

      <section class="fr-col-12 fr-col-md-9 content">
        <h1 class="fr-h3 fr-mb-0">{title}</h1>

        {@render nav(sections, 'fr-col-12 fr-unhidden fr-hidden-md')}

        {#each sections as section}
          <Step {...section} />
        {/each}
      </section>
    </div>
  </div>
</Section>

{#snippet nav(sections: StepSection[], className: string)}
  <nav
    class={className}
    id="navigation">
    <ul>
      {#each sections as section}
        <li>
          <a
            href={`#${section.id}`}
            class="fr-link"
            class:active={activeSection?.id === section.id}>
            {section.title}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
{/snippet}

<style lang="postcss">
  nav {
    border-bottom: solid 1px var(--color-grey-default);

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
    aside {
      display: flex;
      align-items: flex-start;
    }

    nav {
      position: sticky;
      top: var(--6w);
      padding-inline-end: var(--3w);
      border-right: solid 1px var(--color-grey-default);
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

    .content {
      padding-inline-start: var(--6w);
    }
  }

  @media (--md-viewport) {
    nav {
      padding-inline-end: var(--6w);
    }

    .content {
      padding-inline-start: var(--12w);
    }
  }
</style>
