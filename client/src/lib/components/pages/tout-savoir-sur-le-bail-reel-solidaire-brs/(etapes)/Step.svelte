<script lang="ts">
  type Props = {
    id: string;
    title: string;
    content: string;
  };

  const { id, title, content }: Props = $props();
</script>

<article {id}>
  <h2 class="fr-h5 heading">{title}</h2>
  {@html content}
</article>

<style lang="postcss">
  article {
    padding-block-end: var(--3w);
    border-bottom: solid 1px var(--color-grey-default);

    &:nth-last-child(1) {
      border-bottom: none;
    }
  }

  .heading {
    padding-block-start: var(--5w);
  }

  @media (--sm-viewport) {
    article {
      padding-block-end: var(--4w);
    }

    .heading {
      padding-block-start: var(--6w);
    }
  }
</style>
