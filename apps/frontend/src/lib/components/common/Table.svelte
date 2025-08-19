<script lang="ts">
  import { onMount } from 'svelte';

  import '@gouvfr/dsfr/dist/component/table/table.min.css';

  onMount(async () => {
    // @ts-expect-error: no declaration file
    await import('@gouvfr/dsfr/dist/component/table/table.module.min.js');
  });

  type Props = {
    theads: string[];
    tbodies: string[][];
    caption?: string;
  };

  const { caption, theads, tbodies }: Props = $props();
</script>

<div
  class="fr-table fr-table--lg fr-table--bordered"
  id="table-0-component">
  <div class="fr-table__wrapper">
    <div class="fr-table__container">
      <div class="fr-table__content">
        <table id="table">
          {#if caption}
            <caption>{caption}</caption>
          {/if}
          <thead>
            <tr>
              {#each theads as head}
                <th>{@html head}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each tbodies as row, index}
              <tr
                id={`table-row-key-${index}`}
                data-row-key={index}>
                {#each row as cell}
                  <td>{@html cell}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
