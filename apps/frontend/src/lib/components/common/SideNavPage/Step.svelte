<script lang="ts">
  type Props = {
    id: string;
    title: string;
    content: string;
  };

  const { id, title, content }: Props = $props();
</script>

<article
  {id}
  class="!pb-8 border-b border-gray-light">
  <h2 class="fr-h5 pt-12">{title}</h2>
  {@html content}
</article>
