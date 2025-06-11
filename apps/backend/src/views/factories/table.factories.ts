import { DepartementRelationnalView } from 'src/application/departement/views/relationnal.view';
import { DistributorRelationnalView } from 'src/application/distributor/views/relationnal.view';
import { OfsView } from 'src/application/ofs/views/ofs.view';
import { Pagination } from 'src/application/pagination/pagination';
import { RegionRelationnalView } from 'src/application/region/views/relationnal.view';

export type Column = {
  key: keyof Views;
  label: string;
  type: 'string' | 'link' | 'mailto' | 'array' | 'actions';
  arrayKey?: keyof RelationnalView;
  color?: 'blue' | 'orange' | 'green' | 'purple';
};

export type PageNavigation = {
  number?: number;
  isCurrent?: boolean;
  isEllipsis?: boolean;
  isPrevious?: boolean;
  isNext?: boolean;
  disabled?: boolean;
};

export type Views = OfsView;
export type RelationnalView =
  | RegionRelationnalView
  | DepartementRelationnalView
  | DistributorRelationnalView;

export class TableFactory {
  public static createTable(columns: Column[], pagination: Pagination<Views>) {
    const { items, totalCount, page, hasPreviousPage, hasNextPage, pageSize } =
      pagination;

    return {
      columns: columns.map((column) => column.label),
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

  private static formatRows(columns: Column[], items: Views[]) {
    return items.map((item) => {
      return columns.map((column) => {
        switch (column.type) {
          case 'string':
            return item[column.key] || '-';
          case 'link':
            return {
              isLink: true,
              href: item[column.key],
              text: column.label,
            };
          case 'mailto':
            return {
              isMailto: true,
              href: `mailto:${item[column.key] as string}`,
              text: item[column.key],
            };
          case 'array':
            return {
              isArray: true,
              value: (item[column.key] as [])?.map(
                (item: Views) => item[column.arrayKey as keyof RelationnalView],
              ),
              color: column.color,
            };
          case 'actions':
            return {
              isActions: true,
              value: item[column.key],
            };
          default:
            return item[column.key];
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
