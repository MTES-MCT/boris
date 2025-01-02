<script lang="ts">
  type Props = {
    id: string;
    title: string;
    content: string;
  };

  const { id, title, content }: Props = $props();
</script>

<article {id}>
  <h5 aria-level="3">{title}</h5>
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

  h5 {
    padding-block-start: var(--5w);
  }

  @media (--sm-viewport) {
    article {
      padding-block-end: var(--4w);
    }

    h5 {
      padding-block-start: var(--6w);
    }
  }
</style>
