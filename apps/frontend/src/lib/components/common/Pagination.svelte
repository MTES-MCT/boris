<script lang="ts">
  import '@gouvfr/dsfr/dist/component/pagination/pagination.min.css';

  import { goto } from '$app/navigation';
  import Select from '$lib/components/common/Select.svelte';
  import type { Pagination } from '$lib/utils/api-types';
  import type { ComponentProps } from 'svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';

  type Props = Pagination<unknown> & {
    baseUrl: string;
  };

  const {
    page,
    pageSize,
    pagesCount,
    hasPreviousPage,
    hasNextPage,
    baseUrl,
  }: Props = $props();

  const generatePageNumbers = (
    pagesAround: number,
  ): (number | 'ellipsis')[] => {
    const pageNumbers: (number | 'ellipsis')[] = [];

    const start = Math.max(1, page - pagesAround);
    const end = Math.min(pagesCount, page + pagesAround);

    if (start > 1) {
      pageNumbers.push(1);
      if (start > 1) {
        pageNumbers.push('ellipsis');
      }
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (end < pagesCount) {
      if (end < pagesCount - 1) {
        pageNumbers.push('ellipsis');
      }

      pageNumbers.push(pagesCount);
    }

    return pageNumbers;
  };

  const generateSelecOptions = (): ComponentProps<typeof Select>['options'] => {
    const selectOptions: ComponentProps<typeof Select>['options'] = [];

    for (let i = 1; i <= pagesCount; i++) {
      selectOptions.push({
        value: i,
        label: `Page ${i}`,
        selected: page === i,
      });
    }

    return selectOptions;
  };

  const mobilePageNumbers = $derived(generatePageNumbers(1));
  const desktopPageNumbers = $derived(generatePageNumbers(2));
  const options = $derived(generateSelecOptions());

  const handleSelect = (e: Event) => {
    const target = e.target as HTMLSelectElement;

    goto(`${baseUrl}?page=${target.value}&pageSize=${pageSize}`);
  };

  const buildUrl = (page: number) => {
    return `${baseUrl}?page=${page}&pageSize=${pageSize}&latitude=${annuaireManager.latitude}&longitude=`;
  };
</script>

<div class="fr-select-group">
  <Select
    label="Pagination"
    id="page-select"
    {options}
    onChange={handleSelect} />
  <div
    class="fr-messages-group"
    id="page-select-messages"
    aria-live="polite">
  </div>
</div>

<nav
  class="fr-pagination"
  aria-label="Pagination"
  data-fr-analytics-page-total={pagesCount}>
  <ul class="fr-pagination__list">
    <li class="fr-hidden fr-unhidden-sm">
      {#if hasPreviousPage}
        <a
          class="fr-pagination__link fr-pagination__link--first"
          href={`${baseUrl}`}
          title="Première page">
          Première page
        </a>
      {:else}
        <span
          class="fr-pagination__link fr-pagination__link--first disabled"
          title="Première page">
          Première page
        </span>
      {/if}
    </li>
    <li>
      {#if hasPreviousPage}
        <a
          class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
          href={`${baseUrl}?page=${page - 1}&pageSize=${pageSize}`}
          title="Page précédente">
          Page précédente
        </a>
      {:else}
        <span
          class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label disabled">
          Page précédente
        </span>
      {/if}
    </li>
    {#each mobilePageNumbers as pageNumber}
      <li class="fr-hidden-md">
        {#if pageNumber === 'ellipsis'}
          <span class="fr-pagination__link">…</span>
        {:else if pageNumber === page}
          <span
            class="fr-pagination__link"
            aria-current="page"
            title={`Page ${pageNumber}`}>
            {pageNumber}
          </span>
        {:else}
          <a
            class="fr-pagination__link"
            href={`${baseUrl}?page=${pageNumber}&pageSize=${pageSize}`}
            title={`Page ${pageNumber}`}>
            {pageNumber}
          </a>
        {/if}
      </li>
    {/each}
    {#each desktopPageNumbers as pageNumber}
      <li class="fr-hidden fr-unhidden-md">
        {#if pageNumber === 'ellipsis'}
          <span class="fr-pagination__link">…</span>
        {:else if pageNumber === page}
          <span
            class="fr-pagination__link"
            aria-current="page"
            title={`Page ${pageNumber}`}>
            {pageNumber}
          </span>
        {:else}
          <a
            class="fr-pagination__link"
            href={`${baseUrl}?page=${pageNumber}&pageSize=${pageSize}`}
            title={`Page ${pageNumber}`}>
            {pageNumber}
          </a>
        {/if}
      </li>
    {/each}
    <li>
      {#if hasNextPage}
        <a
          class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
          href={`${baseUrl}?page=${page + 1}&pageSize=${pageSize}`}
          title="Page suivante">
          Page suivante
        </a>
      {:else}
        <span
          class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label disabled"
          title="Page suivante">
          Page suivante
        </span>
      {/if}
    </li>
    <li class="fr-hidden fr-unhidden-sm">
      {#if hasNextPage}
        <a
          class="fr-pagination__link fr-pagination__link--last"
          href={`${baseUrl}?page=${pagesCount}&pageSize=${pageSize}`}
          title="Dernière page">
          Dernière page
        </a>
      {:else}
        <span
          class="fr-pagination__link fr-pagination__link--last disabled"
          title="Dernière page">
          Dernière page
        </span>
      {/if}
    </li>
  </ul>
</nav>

<style lang="postcss">
  .fr-select-group {
    display: block;

    @media (--xxs-viewport) {
      display: none;
    }
  }

  .fr-pagination {
    display: none;
    justify-content: center;

    @media (--xxs-viewport) {
      display: flex;
    }
  }
</style>
