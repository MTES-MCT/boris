import {
  Controller,
  Get,
  Query,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { FindAllUsersUsecase } from 'src/application/user/usecases/findAll.usecase';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { UsersFiltersDTO } from '../../dtos/admin/users-filters.dto';
import { UsersPageBuilder } from '../../users-page.builder';
import { UsersFiltersView } from '../../users.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

@ApiExcludeController()
@Controller('/users')
export class GetUsersAdminController {
  constructor(
    private readonly findAllUsersUsecase: FindAllUsersUsecase,
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  public async index(@Query() filters: UsersFiltersDTO, @Res() res: Response) {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 150;

    const users = await this.findAllUsersUsecase.execute(
      {
        page,
        pageSize,
      },
      {
        role: UsersPageBuilder.toRole(filters.role),
        isActive: filters.isActive,
        ofsId: filters.ofsId,
        search: filters.search?.trim() || undefined,
      },
    );

    const viewFilters: UsersFiltersView = {
      page,
      pageSize,
      role: filters.role,
      isActive: filters.isActive,
      ofsId: filters.ofsId,
      search: filters.search?.trim() || '',
    };

    const ofss = await this.ofsRepository.find({ order: { name: 'ASC' } });
    const selectedOfsName = ofss.find(
      (ofs) => ofs.id === viewFilters.ofsId,
    )?.name;

    return res.render('users/index', {
      layout: 'layouts/main',
      title: 'Utilisateurs',
      breadcrumbLinks: [{ label: 'Utilisateurs', href: '/users' }],
      users,
      filters: viewFilters,
      ofss,
      returnTo: UsersPageBuilder.currentListHref(viewFilters),
      ...UsersPageBuilder.buildListView(
        users.items,
        users,
        viewFilters,
        selectedOfsName,
      ),
    });
  }
}
