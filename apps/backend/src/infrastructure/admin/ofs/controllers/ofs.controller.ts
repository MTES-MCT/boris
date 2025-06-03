import { Get, Controller, Res, UseGuards, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { GetAllOfssUsecase } from 'src/application/ofs/usecases/getAll.usecase';
import { MAX_PAGE_SIZE } from 'src/application/pagination/pagination';
import { LocalRequireAuthFilter } from 'src/infrastructure/admin/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/admin/auth/guards/local.isAuthenticated.guard';
import messages from 'src/infrastructure/utils/messages';
import { TableFactory } from 'src/infrastructure/admin/factories/table.factories';
@Controller('/ofs')
export class AdminOfsController {
  constructor(private readonly getAllOfssUsecase: GetAllOfssUsecase) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  public async getAll(@Res() res: Response) {
    const ofss = await this.getAllOfssUsecase.execute({
      page: 1,
      pageSize: MAX_PAGE_SIZE,
    });

    const { columns, rows } = TableFactory.createTable(
      messages.contents.ofs.columns,
      ofss.items,
    );

    res.render('ofs/index', {
      layout: 'layouts/main',
      title: messages.contents.ofs.title,
      breadcrumbLinks: [
        {
          label: 'OFS',
          href: '/ofs',
        },
      ],
      action: messages.contents.ofs.action.label,
      columns,
      rows,
    });
  }
}
