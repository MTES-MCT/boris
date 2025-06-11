import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';

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
    return row[0];
  });

  app.setViewEngine('hbs');
}
