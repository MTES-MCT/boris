import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Request } from 'express';
import { PortalApiAuthenticatedGuard } from '../auth/guards/portal-api-authenticated.guard';
import { UserEntity } from '../user/user.entity';
import { ApiKeysService } from './api-keys.service';
import { AuthRateLimitService } from '../auth/auth-rate-limit.service';

export class CreateApiKeyDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;
}

@ApiExcludeController()
@Controller('/api/portal/api-keys')
@UseGuards(PortalApiAuthenticatedGuard)
export class ApiKeysController {
  constructor(
    private readonly keys: ApiKeysService,
    private readonly rateLimit: AuthRateLimitService,
  ) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  list(@Req() request: Request) {
    return this.keys.list((request.user as UserEntity).id);
  }

  @Post()
  @Header('Cache-Control', 'no-store')
  async create(@Req() request: Request, @Body() body: CreateApiKeyDto) {
    const user = request.user as UserEntity;
    await this.rateLimit.consume(`api-key-create:${user.id}`, 20, 60_000);
    return this.keys.create(user, body.name);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Req() request: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.keys.remove((request.user as UserEntity).id, id);
  }
}
