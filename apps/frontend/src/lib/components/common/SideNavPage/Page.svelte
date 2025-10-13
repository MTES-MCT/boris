<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { Heading, StepSection } from '$lib/utils/definitions';

  import GradientBackgroundWrapper from '$components/common/GradientBackgroundWrapper.svelte';
  import Section from '$components/common/Section.svelte';
  import Step from '$components/common/SideNavPage/Step.svelte';
  import Nav from '$components/common/SideNavPage/Nav.svelte';
  import StepLink from '$components/common/SideNavPage/StepLink.svelte';

  type Props = {
    title: string;
    sections: StepSection[];
    titleElement?: Heading;
    children?: Snippet;
    previousStep?: {
      title: string;
      slug: string;
    };
    nextStep?: {
      title: string;
      slug: string;
    };
  };

  type ObservableSection = {
    id: string;
    isVisible: boolean;
  };

  const {
    title,
    sections,
    titleElement = 'h1',
    previousStep,
    nextStep,
    children = undefined,
  }: Props = $props();

  let observableSections = $state<ObservableSection[]>(
    sections?.map((section) => ({
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

<GradientBackgroundWrapper>
  {#if children}
    <div class="children">
      {@render children()}
    </div>
  {/if}
  <Section>
    <div class="wrapper">
      <div class="fr-grid-row">
        <div class="fr-col-12 fr-col-sm-3 fr-hidden fr-unhidden-md menu">
          <Nav
            {sections}
            activeSectionId={activeSection?.id} />
        </div>

        <div class="fr-col-12 fr-col-md-9 content">
          <svelte:element
            this={titleElement}
            class="fr-h3">
            {title}
          </svelte:element>

          <Nav
            {sections}
            className="fr-col-12 fr-unhidden fr-hidden-md"
            activeSectionId={activeSection?.id} />

          {#each sections as section}
            <Step {...section} />
          {/each}

          <nav
            class="step-links"
            aria-label="liens vers les autres étapes du BRS">
            {#if previousStep}
              <StepLink
                title={previousStep.title}
                label="Étape précédente"
                href={previousStep.slug} />
            {:else}
              <div></div>
            {/if}

            {#if nextStep}
              <StepLink
                title={nextStep.title}
                label="Étape suivante"
                href={nextStep.slug} />
            {:else}
              <div></div>
            {/if}
          </nav>
        </div>
      </div>
    </div>
  </Section>
</GradientBackgroundWrapper>

<style lang="postcss">
  .children {
    margin-block-end: var(--6w);
  }

  .step-links {
    display: flex;
    flex-direction: column;
    gap: var(--3w);
    padding-block-start: var(--5w);
    padding-block-end: var(--1w);
  }

  h1 {
    margin-block-end: var(--5w);
  }

  @media (--sm-viewport) {
    .menu {
      display: flex;
      align-items: flex-start;
    }

    .content {
      padding-inline-start: var(--6w);
    }

    .step-links {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  @media (--md-viewport) {
    h1 {
      margin-block-end: var(--6w);
    }

    .children {
      margin-block-end: var(--12w);
    }

    .content {
      padding-inline-start: var(--12w);
    }
  }
</style>
