import { Get, Controller, Res, UseGuards, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { GetAllOfssUsecase } from 'src/application/ofs/usecases/getAll.usecase';
import { MAX_PAGE_SIZE } from 'src/application/pagination/pagination';
import { LocalRequireAuthFilter } from 'src/infrastructure/admin/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/admin/auth/guards/local.isAuthenticated.guard';
import messages from 'src/infrastructure/flash/messages';

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

    // TODO: use factory to format the data

    res.render('ofs/index', {
      layout: 'layouts/main',
      title: messages.contents.ofs.title,
      tableHeaders: messages.contents.ofs.tableHeads,
      tableRows: ofss.items.map((ofs) => {
        return [
          ofs.name,
          ofs.regions.map((region) => region.name).join(', '),
          ofs.departements.map((departement) => departement.name).join(', '),
          ofs.distributors.map((distributor) => distributor.name).join(', '),
          ofs.phone || '-',
          ofs.websiteUrl
            ? {
                isLink: true,
                href: ofs.websiteUrl,
                text: 'Site internet',
                external: true,
              }
            : '-',
          ofs.email
            ? { isLink: true, href: `mailto:${ofs.email}`, text: ofs.email }
            : '-',
        ];
      }),
    });
  }
}
