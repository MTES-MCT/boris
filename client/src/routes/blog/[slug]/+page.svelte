<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css';
  import type { Props } from './definitions';
  import Section from '$components/common/Section.svelte';
  import { formatPublishedAt } from '$lib/utils/formatters';

  const { data }: Props = $props();
  const { article } = data;
</script>

<svelte:head>
  <title>{article.title}</title>
  <meta
    name="description"
    content={article.description} />
</svelte:head>

<Section
  title={article.title}
  titleElement="h1">
  <p class="fr-card__detail fr-icon-calendar-2-line">
    {formatPublishedAt(article.firstPublishedAt)}
  </p>
  {#if article.body}
    {#each article.body as { type, value }}
      {#if type === 'paragraph'}
        {@html value}
      {:else if type === 'image'}
        <img
          src={value.url}
          alt={value.alt} />
      {/if}
    {/each}
  {/if}
</Section>

<style>
  img {
    max-width: 100%;
  }

  .fr-card__detail {
    display: flex;
    align-items: center;
    margin-block-end: var(--3w);

    &::before {
      --icon-size: 1rem;
    }
  }
</style>
