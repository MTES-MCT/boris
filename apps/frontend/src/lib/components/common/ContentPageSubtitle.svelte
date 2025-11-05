<script lang="ts">
  type Props = {
    title: string;
  };

  const { title }: Props = $props();
</script>

<h2 class="fr-h5 fr-mt-5w fr-mb-2w">{title}</h2>
