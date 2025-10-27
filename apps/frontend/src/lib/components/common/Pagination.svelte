<script lang="ts">
  import '@gouvfr/dsfr/dist/component/pagination/pagination.min.css';

  import { goto } from '$app/navigation';
  import Select from '$lib/components/common/Select.svelte';
  import type { Pagination } from '$lib/utils/api-types';
  import type { ComponentProps } from 'svelte';
  import annuaireManager from '$lib/managers/annuaire.svelte';
  import { addSmoothScroll, removeSmoothScroll } from '$lib/utils/helpers';

  type Props = Pagination<unknown> & {
    baseUrl: string;
    scrollToElementId?: string;
  };

  const {
    page,
    pageSize,
    pagesCount,
    hasPreviousPage,
    hasNextPage,
    baseUrl,
    scrollToElementId = '',
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

  const handleClick = (page: number) => {
    removeSmoothScroll();
    annuaireManager.setListBrsDiffusionWebsites({ page });

    const scrollToElement = document.getElementById(scrollToElementId);

    setTimeout(() => {
      window.scrollTo(0, scrollToElement?.offsetTop || 0);
      addSmoothScroll();
    }, 50);
  };
</script>

<div class="fr-select-group block xxs_none">
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
  class="fr-pagination none xxs_flex justify-center"
  aria-label="Pagination"
  data-fr-analytics-page-total={pagesCount}>
  <ul class="fr-pagination__list">
    <li class="fr-hidden fr-unhidden-sm">
      {#if hasPreviousPage}
        <button
          class="fr-pagination__link fr-pagination__link--first"
          onclick={() => handleClick(1)}
          title="Première page">
          Première page
        </button>
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
        <button
          class="fr-pagination__link fr-pagination__link--prev fr-pagination__link--lg-label"
          onclick={() => handleClick(page - 1)}
          title="Page précédente">
          Page précédente
        </button>
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
          <button
            class="fr-pagination__link"
            onclick={() => handleClick(pageNumber)}
            title={`Page ${pageNumber}`}>
            {pageNumber}
          </button>
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
          <button
            class="fr-pagination__link"
            onclick={() => handleClick(pageNumber)}
            title={`Page ${pageNumber}`}>
            {pageNumber}
          </button>
        {/if}
      </li>
    {/each}
    <li>
      {#if hasNextPage}
        <button
          class="fr-pagination__link fr-pagination__link--next fr-pagination__link--lg-label"
          onclick={() => handleClick(page + 1)}
          title="Page suivante">
          Page suivante
        </button>
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
        <button
          class="fr-pagination__link fr-pagination__link--last"
          onclick={() => handleClick(pagesCount)}
          title="Dernière page">
          Dernière page
        </button>
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
