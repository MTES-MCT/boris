import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import { Row } from 'src/views/factories/table.factories';
export function configureViewEngine(app: NestExpressApplication) {
  app.useStaticAssets(join(__dirname, '../', '../', 'assets'));
  app.setBaseViewsDir(join(__dirname, '../', '../', 'views'));
  hbs.registerPartials(join(__dirname, '../', '../', 'views', 'layouts'));
  hbs.registerPartials(join(__dirname, '../', '../', 'views', 'partials'));

  hbs.registerHelper('or', (a, b) => {
    return a || b;
  });

  hbs.registerHelper('concat', (a, b) => {
    return `${a}${b}`;
  });

  hbs.registerHelper('stringify', (a) => {
    return JSON.stringify(a);
  });

  hbs.registerHelper('rowName', (row) => {
    return row[0].value;
  });

  hbs.registerHelper('row', (row) => {
    return row;
  });

  hbs.registerHelper('ifNot', (a) => {
    return !a;
  });

  hbs.registerHelper('isEqual', (a, b) => {
    return a === b;
  });

  hbs.registerHelper('getRowEntity', (row: Row<unknown>[]) => {
    return row.find((cell) => cell.isEntity)?.value;
  });

  hbs.registerHelper('contains', (a: any, b: any[]) => {
    return b.includes(a);
  });

  hbs.registerHelper('entitiesToIds', (a: any[]) => {
    return a.map((entity) => entity.id);
  });

  app.setViewEngine('hbs');
}
