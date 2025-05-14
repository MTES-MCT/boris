import { PaginationProps } from 'src/domain/pagination/paginationProps';

describe('PaginationProps', () => {
  it('getters', () => {
    const paginationProps = new PaginationProps(1, 10);

    expect(paginationProps.page).toBe(1);
    expect(paginationProps.pageSize).toBe(10);
  });
});
