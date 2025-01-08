<script lang="ts">
  import type { Props } from './definitions';
  import Section from '$components/common/Section.svelte';
  import ArticleCard from '$components/pages/blog/ArticleCard.svelte';

  const { data }: Props = $props();
</script>

<svelte:head>
  <title>Boris - Blog</title>
</svelte:head>

<Section
  title="Blog"
  titleElement="h1">
  <div class="fr-grid-row fr-grid-row--gutters">
    {#each data.articles as { title, description, firstPublishedAt, slug }}
      <div class="fr-col-12 fr-col-md-6">
        <ArticleCard
          {title}
          {description}
          {slug}
          {firstPublishedAt} />
      </div>
    {/each}
  </div>
</Section>
