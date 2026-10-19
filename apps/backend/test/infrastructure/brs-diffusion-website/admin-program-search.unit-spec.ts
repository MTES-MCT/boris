import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { Pagination } from 'src/application/common/pagination';
import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';
import { GetBrsDiffusionWebsitesAdminController } from 'src/infrastructure/brs-diffusion-website/controllers/admin/get-brs-diffusion-websites.controller';
import { AdminProgramsFiltersDTO } from 'src/infrastructure/brs-diffusion-website/dtos/admin-programs-filters.dto';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

describe('Admin program search', () => {
  it.each(['  Lyon  ', '750', 'Habitat & Co', '   '])(
    'normalizes %j and keeps the search in the rendered page',
    async (search) => {
      const execute = jest
        .fn()
        .mockResolvedValue(new Pagination([], 0, { page: 1, pageSize: 10 }));
      const controller = new GetBrsDiffusionWebsitesAdminController(
        { execute } as unknown as FindAllBrsDiffusionWebsitesUsecase,
        {
          find: jest.fn().mockResolvedValue([]),
        } as unknown as Repository<OfsEntity>,
        {
          find: jest.fn().mockResolvedValue([]),
        } as unknown as Repository<DistributorEntity>,
      );
      const render = jest.fn();

      await controller.getBrsDiffusionWebsites(
        { page: 1, pageSize: 10, search },
        { render } as unknown as Response,
      );

      expect(execute).toHaveBeenCalledWith({
        page: 1,
        pageSize: 10,
        search: search.trim() || undefined,
      });
      expect(render).toHaveBeenCalledWith(
        'brs-diffusion-website/index',
        expect.objectContaining({ search: search.trim() }),
      );
    },
  );

  it('accepts a search with pagination and rejects repeated search parameters', async () => {
    const valid = plainToInstance(AdminProgramsFiltersDTO, {
      search: '750',
      page: '2',
      pageSize: '10',
    });
    expect(await validate(valid)).toEqual([]);
    expect(valid.page).toBe(2);

    const invalid = plainToInstance(AdminProgramsFiltersDTO, {
      search: ['Lyon', 'Paris'],
    });
    expect(await validate(invalid)).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'search' })]),
    );
  });
});
