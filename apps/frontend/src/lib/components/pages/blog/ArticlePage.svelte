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
  <p class="fr-card__detail flex align-center gap-1v fr-mb-3w">
    <span class="fr-icon-calendar-2-line fr-icon--sm"></span>
    {formatPublishedAt(article?.firstPublishedAt as string)}
  </p>
  {@render children()}
</Section>
