import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CreateManagedUserUsecase } from 'src/application/user/usecases/create-managed-user.usecase';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { CreateUserDTO } from '../../dtos/admin/create-user.dto';
import { UsersPageBuilder } from '../../users-page.builder';
import { RequestWithFlash } from 'src/types/request-with-flash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

@ApiExcludeController()
@Controller('/users')
export class CreateUserAdminController {
  constructor(
    private readonly createManagedUserUsecase: CreateManagedUserUsecase,
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get('/create')
  @Render('users/create')
  public async createPage(@Query('returnTo') returnTo?: string) {
    const ofss = await this.ofsRepository.find({ order: { name: 'ASC' } });

    return {
      layout: 'layouts/main',
      title: 'Créer un utilisateur',
      breadcrumbLinks: [
        { label: 'Utilisateurs', href: '/users' },
        { label: 'Créer un utilisateur' },
      ],
      form: { email: '', role: '', ofsIds: [] },
      errors: {},
      returnTo,
      ofss,
      ...UsersPageBuilder.buildSharedFormView(),
    };
  }

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post('')
  public async createUser(
    @Body() body: CreateUserDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const { user, generatedPassword } =
        await this.createManagedUserUsecase.execute(body);

      (req as RequestWithFlash).flash('generatedPassword', generatedPassword);

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, `/users/${user.id}/update`);
          resolve();
        });
      });
    } catch (error) {
      const ofss = await this.ofsRepository.find({ order: { name: 'ASC' } });

      return res.status(400).render('users/create', {
        layout: 'layouts/main',
        title: 'Créer un utilisateur',
        breadcrumbLinks: [
          { label: 'Utilisateurs', href: '/users' },
          { label: 'Créer un utilisateur' },
        ],
        form: {
          email: body.email,
          role: body.role,
          ofsIds: body.ofsIds || [],
        },
        errors: UsersPageBuilder.buildCreateErrors(error),
        ofss,
        ...UsersPageBuilder.buildSharedFormView(),
      });
    }
  }
}
