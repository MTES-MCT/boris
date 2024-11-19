<script lang="ts">
  import type { Props } from './definitions';
  import Section from '$components/section/section.svelte';

  const { data }: Props = $props();
  const { blogPost } = data;
</script>

<svelte:head>
  <title>{blogPost.title}</title>
</svelte:head>

<Section
  title={blogPost.title}
  titleElement="h1">
  {#if blogPost.body}
    {#each blogPost.body as { type, value }}
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
