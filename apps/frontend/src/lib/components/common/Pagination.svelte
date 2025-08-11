<script lang="ts">
  import '@gouvfr/dsfr/dist/component/pagination/pagination.min.css';

  import type { Pagination } from '$lib/utils/api-types';

  type Props = Pagination<unknown> & {
    baseUrl: string;
  };

  const {
    totalCount,
    page,
    pageSize,
    pagesCount,
    hasPreviousPage,
    hasNextPage,
    baseUrl,
  }: Props = $props();
</script>

<p>totalCount: {totalCount}</p>
<p>page: {page}</p>
<p>pageSize: {pageSize}</p>
<p>pagesCount: {pagesCount}</p>
<p>hasPreviousPage: {hasPreviousPage}</p>
<p>hasNextPage: {hasNextPage}</p>

<nav
  class="fr-pagination"
  aria-label="Pagination"
  data-fr-analytics-page-total="132">
  <ul class="fr-pagination__list">
    <li>
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
    <li>
      <a
        class="fr-pagination__link"
        href="#"
        title="Page 1">
        1
      </a>
    </li>
    <li>
      <a
        class="fr-pagination__link"
        aria-current="page"
        title="Page 2">
        2
      </a>
    </li>
    <li>
      <a
        class="fr-pagination__link fr-hidden fr-unhidden-lg"
        href="#"
        title="Page 3">
        3
      </a>
    </li>
    <li>
      <span class="fr-pagination__link fr-hidden fr-unhidden-lg">…</span>
    </li>
    <li>
      <a
        class="fr-pagination__link fr-hidden fr-unhidden-lg"
        href="#"
        title="Page 130">
        130
      </a>
    </li>
    <li>
      <a
        class="fr-pagination__link fr-hidden fr-unhidden-lg"
        href="#"
        title="Page 131">
        131
      </a>
    </li>
    <li>
      <a
        class="fr-pagination__link"
        href="#"
        title="Page 132">
        132
      </a>
    </li>
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
    <li>
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
  .fr-pagination {
    display: flex;
    justify-content: center;
  }
</style>
