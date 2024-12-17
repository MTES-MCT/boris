<script lang="ts">
  import type { Props } from './definitions';
  import Section from '$components/common/Section.svelte';

  const { data }: Props = $props();
  const { article } = data;
</script>

<svelte:head>
  <title>{article.title}</title>
</svelte:head>

<Section
  title={article.title}
  titleElement="h1">
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
</style>
