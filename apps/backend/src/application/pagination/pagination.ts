import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PaginationProps } from 'src/domain/pagination/paginationProps';

export const MAX_PAGE_SIZE = 100;

export class Pagination<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  public items: T[];

  @ApiProperty()
  public readonly totalCount: number;

  @ApiProperty()
  public readonly page: number;

  @ApiProperty()
  public readonly pageSize: number;

  @ApiProperty()
  public readonly pagesCount: number;

  @ApiProperty()
  public readonly hasPreviousPage: boolean;

  @ApiProperty()
  public readonly hasNextPage: boolean;

  constructor(
    items: T[],
    totalCount: number,
    paginationProps: PaginationProps,
  ) {
    this.items = items;
    this.totalCount = totalCount;
    this.page = paginationProps.page;
    this.pageSize = paginationProps.pageSize;
    this.pagesCount = Math.ceil(this.totalCount / this.pageSize);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pagesCount;
  }
}
