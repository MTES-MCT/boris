<script lang="ts">
  import { nanoid } from 'nanoid';
  import type { Snippet } from 'svelte';
  import Table from '$components/common/Table.svelte';

  type Props = {
    title: string;
    headings: string[];
    rows: string[][];
    children: Snippet;
  };

  const { title, headings, rows, children }: Props = $props();
  const descriptionId = `chart-description-${nanoid(10)}`;
</script>

<div
  role="img"
  aria-label={title}
  aria-describedby={descriptionId}>
  <div aria-hidden="true">
    {@render children()}
  </div>
</div>
<p
  id={descriptionId}
  class="fr-sr-only">
  Les données de ce graphique sont disponibles dans le volet « Consulter les
  données en tableau » qui suit.
</p>
<details class="fr-mt-4w">
  <summary class="fr-link cursor-pointer">
    Consulter les données en tableau
    <span class="fr-sr-only">: {title}</span>
  </summary>
  <div class="fr-mt-2w">
    <Table
      caption={title}
      theads={headings}
      tbodies={rows}
      firstColumnHeader
      textOnly
      multiline />
  </div>
</details>
