<script lang="ts">
  import '@gouvfr/dsfr/dist/component/table/table.min.css';

  import { nanoid } from 'nanoid';

  import dsfrManager from '$lib/managers/dsfr.svelte';

  type Props = {
    theads: string[];
    tbodies: string[][];
    caption?: string;
    size?: 'sm' | 'md' | 'lg';
    multiline?: boolean;
    firstColumnHeader?: boolean;
    textOnly?: boolean;
  };

  $effect(() => {
    if (dsfrManager.isWindowDsfrDefined) {
      // @ts-expect-error: no declaration file
      import('@gouvfr/dsfr/dist/component/table/table.module.min.js');
    }
  });

  const {
    caption,
    theads,
    tbodies,
    size = 'md',
    multiline = false,
    firstColumnHeader = false,
    textOnly = false,
  }: Props = $props();

  const tableId = `table-${nanoid(10)}`;
</script>

<div
  style="width: 100%;"
  class="fr-table fr-table--{size} fr-table--bordered"
  class:fr-table--multiline={multiline}
  id={`${tableId}-container`}>
  <div class="fr-table__wrapper">
    <div class="fr-table__container">
      <div class="fr-table__content">
        <table id={tableId}>
          {#if caption}
            <caption class="fr-sr-only">{caption}</caption>
          {/if}
          <thead>
            <tr>
              {#each theads as head}
                <th scope="col">
                  {#if textOnly}{head}{:else}{@html head}{/if}
                </th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each tbodies as row, index}
              <tr
                id={`${tableId}-row-${index}`}
                data-row-key={index}>
                {#each row as cell, cellIndex}
                  {#if firstColumnHeader && cellIndex === 0}
                    <th scope="row">
                      {#if textOnly}{cell}{:else}{@html cell}{/if}
                    </th>
                  {:else}
                    <td>
                      {#if textOnly}{cell}{:else}{@html cell}{/if}
                    </td>
                  {/if}
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
