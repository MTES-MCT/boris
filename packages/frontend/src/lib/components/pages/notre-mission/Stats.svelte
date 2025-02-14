<script lang="ts">
  import Section from '$components/common/Section.svelte';
  import Disclaimer from '$components/common/Disclaimer.svelte';
  import type { Statistic } from '$lib/utils/definitions';
  import { statistics } from '$lib/utils/constants';
</script>

<Section id="statistiques">
  <div class="content rounded-box-md background-color-white">
    <Disclaimer content="en chiffres clés" />

    <ul>
      {#each statistics as statistic}
        {@render stat(statistic)}
      {/each}
    </ul>
  </div>
</Section>

{#snippet stat({ amount, subtitle, content }: Statistic)}
  <li>
    <h3 class="numbers fr-mb-0">
      <span class="fr-h2 fr-mb-0 heading">{amount}</span>
      <span class="fr-text--md fr-mb-0 subtitle"><b>{subtitle}</b></span>
    </h3>
    <p class="text">{content}</p>
  </li>
{/snippet}

<style lang="postcss">
  .content {
    max-width: 768px;
    margin: 0 auto;
    padding: var(--2w);
  }

  .heading {
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

    .heading {
      margin-inline-end: 0;
      display: block;
    }

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
