<script lang="ts">
  import type { Props } from './definitions';
  import Section from '$lib/components/section/section.svelte';
  import BlogPost from '$lib/components/blogPost/blogPost.svelte';

  const { data }: Props = $props();
</script>

<Section
  title="Blog"
  titleElement="h1">
  <div class="fr-grid-row fr-grid-row--gutters">
    {#each data.blogPosts as { title, description, firstPublishedAt, slug }}
      <div class="fr-col-12 fr-col-md-6">
        <BlogPost
          {title}
          {description}
          {slug}
          {firstPublishedAt} />
      </div>
    {/each}
  </div>
</Section>
