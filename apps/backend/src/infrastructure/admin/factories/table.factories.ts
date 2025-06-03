import { DepartementRelationnalView } from 'src/application/departement/views/relationnal.view';
import { DistributorRelationnalView } from 'src/application/distributor/views/relationnal.view';
import { OfsView } from 'src/application/ofs/views/ofs.view';
import { RegionRelationnalView } from 'src/application/region/views/relationnal.view';

export type Column = {
  key: keyof Views;
  label: string;
  type: 'string' | 'link' | 'mailto' | 'array';
  arrayKey?: keyof RelationnalView;
};

export type Views = OfsView;
export type RelationnalView =
  | RegionRelationnalView
  | DepartementRelationnalView
  | DistributorRelationnalView;

export class TableFactory {
  public static createTable(columns: Column[], items: Views[]) {
    return {
      columns: columns.map((column) => column.label),
      rows: this.formatRows(columns, items),
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
            };
          default:
            return item[column.key];
        }
      });
    });
  }
}
