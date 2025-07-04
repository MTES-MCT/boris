import { DepartementRelationnalView } from 'src/application/departement/views/relationnal.view';
import { DistributorView } from 'src/application/distributor/views/distributor.view';
import { DistributorRelationnalView } from 'src/application/distributor/views/relationnal.view';
import { OfsView } from 'src/application/ofs/views/ofs.view';
import { Pagination } from 'src/application/common/pagination';
import { RegionRelationnalView } from 'src/application/region/views/relationnal.view';
import { RegionView } from 'src/application/region/views/region.view';
import { DepartementView } from 'src/application/departement/views/departement.view';
import { UserView } from 'src/application/user/views/user.view';

type Color = 'blue' | 'orange' | 'green' | 'purple';

export type Column<T> = {
  key: keyof T;
  label: string;
  type: 'string' | 'link' | 'mailto' | 'array' | 'actions' | 'entity';
  arrayKey?: keyof RelationnalView;
  color?: Color;
};

export type Row<T> = {
  value: string | string[] | T;
  isLink?: boolean;
  href?: string;
  isMailto?: boolean;
  isArray?: boolean;
  isActions?: boolean;
  isEntity?: boolean;
  color?: Color;
};

export type PageNavigation = {
  number?: number;
  isCurrent?: boolean;
  isEllipsis?: boolean;
  isPrevious?: boolean;
  isNext?: boolean;
  disabled?: boolean;
};

export type Views =
  | OfsView
  | DistributorView
  | RegionView
  | DepartementView
  | UserView;
export type RelationnalView =
  | RegionRelationnalView
  | DepartementRelationnalView
  | DistributorRelationnalView;

export class TableFactory {
  public static createTable<T extends Views>(
    columns: Column<T>[],
    pagination: Pagination<T>,
  ) {
    const { items, totalCount, page, hasPreviousPage, hasNextPage, pageSize } =
      pagination;

    return {
      columns: columns
        .filter((column) => column.type !== 'entity')
        .map((column) => column.label),
      rows: this.formatRows(columns, items),
      pagination: {
        totalCount,
        page,
        hasPreviousPage,
        hasNextPage,
        lowOffset: (page - 1) * pageSize + 1,
        highOffset: page * pageSize > totalCount ? totalCount : page * pageSize,
        pages: this.generatePageNavigation(
          page,
          Math.ceil(totalCount / pageSize),
        ),
        pageSize,
      },
    };
  }

  private static formatRows<T extends Views>(
    columns: Column<T>[],
    items: T[],
  ): Row<T>[][] {
    return items.map((item) => {
      return columns.map((column) => {
        switch (column.type) {
          case 'string':
            return {
              value: (item[column.key] as string) || '-',
            };
          case 'link':
            return {
              isLink: true,
              href: item[column.key] as string,
              value: column.label,
            };
          case 'mailto':
            return {
              isMailto: true,
              href: `mailto:${item[column.key] as string}`,
              value: (item[column.key] as string) || '-',
            };
          case 'array':
            return {
              isArray: true,
              value: (item[column.key] as unknown as RelationnalView[])?.map(
                (relationnal) =>
                  relationnal[column.arrayKey as keyof RelationnalView],
              ),
              color: column.color,
            };
          case 'actions':
            return {
              isActions: true,
              value: item[column.key] as string,
            };
          case 'entity':
            return {
              isEntity: true,
              value: item,
            };
          default:
            return {
              value: 'hello',
            };
        }
      });
    });
  }

  private static generatePageNavigation(
    current: number,
    last: number,
    delta = 2,
  ): PageNavigation[] {
    if (last === 1) return [{ number: 1, isCurrent: true }];

    const left = current - delta,
      right = current + delta + 1,
      range = [];

    range.push({
      isPrevious: true,
      number: current - 1,
      disabled: current === 1,
    });

    for (let i = 1; i <= last; i++) {
      if (i == 1 || i == last || (i >= left && i < right)) {
        if (i === left && i > 2) {
          range.push({ isEllipsis: true });
        }

        if (i === current) {
          range.push({ number: i, isCurrent: true });
        } else {
          range.push({ number: i });
        }

        if (i === right - 1 && i < last - 1) {
          range.push({ isEllipsis: true });
        }
      }
    }

    range.push({
      isNext: true,
      number: current + 1,
      disabled: current === last,
    });

    return range;
  }
}
