import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { FindUserByIdUsecase } from 'src/application/user/usecases/findById.usecase';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';
import { UpdateUserDTO } from '../../dtos/admin/update-user.dto';
import { UpdateManagedUserUsecase } from 'src/application/user/usecases/update-managed-user.usecase';
import { RequestWithFlash } from 'src/types/request-with-flash';
import { UsersPageBuilder } from '../../users-page.builder';
import { ResetUserPasswordUsecase } from 'src/application/user/usecases/reset-password.usecase';
import { SetUserActiveStatusUsecase } from 'src/application/user/usecases/set-active-status.usecase';
import { UserEntity } from '../../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

@ApiExcludeController()
@Controller('/users')
export class UpdateUserAdminController {
  constructor(
    private readonly findUserByIdUsecase: FindUserByIdUsecase,
    private readonly updateManagedUserUsecase: UpdateManagedUserUsecase,
    private readonly resetUserPasswordUsecase: ResetUserPasswordUsecase,
    private readonly setUserActiveStatusUsecase: SetUserActiveStatusUsecase,
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get(':id/update')
  public async updatePage(
    @Param() params: IdDTO,
    @Query('returnTo') returnTo: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.findUserByIdUsecase.execute(params.id);
    const currentUser = req.user as UserEntity;
    const ofss = await this.ofsRepository.find({ order: { name: 'ASC' } });

    return res.render('users/update', {
      layout: 'layouts/main',
      title: `Utilisateur ${user.email}`,
      breadcrumbLinks: [
        { label: 'Utilisateurs', href: '/users' },
        { label: user.email },
      ],
      user,
      form: {
        email: user.email,
        role: user.roles[0],
        ofsIds: user.ofss.map((ofs) => ofs.id),
      },
      errors: {},
      returnTo,
      generatedPassword: (req as RequestWithFlash).flash(
        'generatedPassword',
      )[0],
      ofss,
      ...UsersPageBuilder.buildEditPageView(user, currentUser.id, returnTo),
    });
  }

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Put(':id')
  public async updateUser(
    @Param() params: IdDTO,
    @Body() body: UpdateUserDTO,
    @Query('returnTo') returnTo: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const currentUser = req.user as UserEntity;

      await this.updateManagedUserUsecase.execute({
        actorUserId: currentUser.id,
        userId: params.id,
        email: body.email,
        role: body.role,
        ofsIds: body.ofsIds,
      });

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, UsersPageBuilder.editPagePath(params.id, returnTo));
          resolve();
        });
      });
    } catch (error) {
      const user = await this.findUserByIdUsecase.execute(params.id);
      const currentUser = req.user as UserEntity;
      const ofss = await this.ofsRepository.find({ order: { name: 'ASC' } });

      return res.status(400).render('users/update', {
        layout: 'layouts/main',
        title: `Utilisateur ${user.email}`,
        breadcrumbLinks: [
          { label: 'Utilisateurs', href: '/users' },
          { label: user.email },
        ],
        user,
        form: {
          email: body.email,
          role: body.role,
          ofsIds: body.ofsIds || [],
        },
        errors: UsersPageBuilder.buildUpdateErrors(error),
        returnTo,
        generatedPassword: undefined,
        ofss,
        ...UsersPageBuilder.buildEditPageView(user, currentUser.id, returnTo),
      });
    }
  }

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post(':id/reset-password')
  public async resetPassword(
    @Param() params: IdDTO,
    @Query('returnTo') returnTo: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const generatedPassword = await this.resetUserPasswordUsecase.execute(
      params.id,
    );

    (req as RequestWithFlash).flash('generatedPassword', generatedPassword);

    await new Promise<void>((resolve) => {
      req.session.save(() => {
        res.redirect(303, UsersPageBuilder.editPagePath(params.id, returnTo));
        resolve();
      });
    });
  }

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post(':id/deactivate')
  public async deactivateUser(
    @Param() params: IdDTO,
    @Query('returnTo') returnTo: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user as UserEntity;

    await this.setUserActiveStatusUsecase.execute({
      actorUserId: currentUser.id,
      userId: params.id,
      isActive: false,
    });

    res.redirect(303, UsersPageBuilder.editPagePath(params.id, returnTo));
  }

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post(':id/reactivate')
  public async reactivateUser(
    @Param() params: IdDTO,
    @Query('returnTo') returnTo: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentUser = req.user as UserEntity;

    await this.setUserActiveStatusUsecase.execute({
      actorUserId: currentUser.id,
      userId: params.id,
      isActive: true,
    });

    res.redirect(303, UsersPageBuilder.editPagePath(params.id, returnTo));
  }
}
