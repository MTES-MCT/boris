import { Pagination } from 'src/application/pagination/pagination';
import { PaginationProps } from 'src/domain/pagination/paginationProps';

describe('Pagination', () => {
  it('should generate valid pagination on first page', () => {
    const paginationProps: PaginationProps = {
      page: 1,
      pageSize: 50,
    };
    const items = new Array(paginationProps.pageSize);
    const totalCount = 999;

    const pagination = new Pagination(items, totalCount, paginationProps);

    expect(pagination.items).toHaveLength(paginationProps.pageSize);
    expect(pagination.page).toBe(paginationProps.page);
    expect(pagination.pageSize).toBe(paginationProps.pageSize);
    expect(pagination.pagesCount).toBe(20);
    expect(pagination.totalCount).toBe(totalCount);
    expect(pagination.hasNextPage).toBeTruthy();
    expect(pagination.hasPreviousPage).toBeFalsy();
  });

  it('should generate valid pagination on random page', () => {
    const paginationProps: PaginationProps = {
      page: 11,
      pageSize: 50,
    };
    const items = new Array(paginationProps.pageSize);
    const totalCount = 999;

    const pagination = new Pagination(items, totalCount, paginationProps);

    expect(pagination.items).toHaveLength(paginationProps.pageSize);
    expect(pagination.page).toBe(paginationProps.page);
    expect(pagination.pageSize).toBe(paginationProps.pageSize);
    expect(pagination.pagesCount).toBe(20);
    expect(pagination.totalCount).toBe(totalCount);
    expect(pagination.hasNextPage).toBeTruthy();
    expect(pagination.hasPreviousPage).toBeTruthy();
  });

  it('should generate valid pagination on last page', () => {
    const paginationProps: PaginationProps = {
      page: 20,
      pageSize: 50,
    };
    const totalCount = 999;
    const items = new Array(paginationProps.pageSize);

    const pagination = new Pagination(items, totalCount, paginationProps);

    expect(pagination.items).toHaveLength(paginationProps.pageSize);
    expect(pagination.page).toBe(paginationProps.page);
    expect(pagination.pageSize).toBe(paginationProps.pageSize);
    expect(pagination.pagesCount).toBe(20);
    expect(pagination.totalCount).toBe(totalCount);
    expect(pagination.hasNextPage).toBeFalsy();
    expect(pagination.hasPreviousPage).toBeTruthy();
  });
});
