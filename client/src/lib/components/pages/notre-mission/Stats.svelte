<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Disclaimer from '$components/common/Disclaimer.svelte';
  import type { Statistic } from '$lib/utils/definitions';
  import { statistics } from '$lib/utils/constants';
</script>

<Section id="statistiques">
  <div class="content rounded-box-md fr-background-default--grey">
    <Disclaimer content="en chiffres clés" />

    <ul>
      {#each statistics as statistic}
        {@render stat(statistic)}
      {/each}
    </ul>
  </div>
</Section>

{#snippet stat({ number, subtitle, content }: Statistic)}
  <li>
    <div class="numbers">
      <h2 aria-level="3">{number}</h2>
      <p class="fr-mb-0 subtitle"><b>{subtitle}</b></p>
    </div>
    <p class="text">{content}</p>
  </li>
{/snippet}

<style lang="postcss">
  .content {
    max-width: 792px;
    margin: 0 auto;
    padding: var(--2w);
  }

  h2 {
    margin: 0;
    display: inline;
    margin-inline-end: var(--1w);
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .subtitle {
    display: inline;
  }

  @media (--xs-viewport) {
    .content {
      padding: var(--5w);
    }
  }

  @media (--sm-viewport) {
    ul {
      display: flex;
      flex-direction: column;
      gap: var(--3w);
      margin-block-start: var(--3w);
    }

    li {
      display: flex;
      gap: var(--3w);
      align-items: center;
    }

    h2,
    .subtitle {
      display: block;
    }

    .numbers {
      flex: 1;
      text-align: right;
    }

    .text {
      flex: 1;
      margin: 0;
    }
  }
</style>
