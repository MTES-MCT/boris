<script lang="ts">
  import Section from '$components/section/section.svelte';
  import type { Props } from './definitions';

  const { data }: Props = $props();
  const { blogPost } = data;
</script>

<Section
  title={blogPost.title}
  titleElement="h1">
  {#if blogPost.body}
    {#each blogPost.body as element}
      {@html element.value}
    {/each}
  {/if}
</Section>
