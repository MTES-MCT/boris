<script lang="ts">
  import '@gouvfr/dsfr/dist/utility/icons/icons-business/icons-business.min.css';
  import Section from '$components/common/Section.svelte';
  import { formatPublishedAt } from '$lib/utils/formatters';
  import type { Snippet } from 'svelte';
  import type { ArticlePreview } from '$lib/utils/definitions';

  type Props = {
    article: ArticlePreview;
    children: Snippet;
  };

  const { article, children }: Props = $props();
</script>

<svelte:head>
  <title>{article?.title}</title>
  <meta
    name="description"
    content={article?.description} />
</svelte:head>

<Section
  title={article?.title}
  titleElement="h1">
  <p class="fr-card__detail fr-icon-calendar-2-line">
    {formatPublishedAt(article?.firstPublishedAt as string)}
  </p>
  {@render children()}
</Section>

<style lang="postcss">
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
