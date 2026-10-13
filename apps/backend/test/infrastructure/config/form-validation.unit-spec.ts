import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as hbs from 'hbs';
import { createValidationPipe } from 'src/infrastructure/config/validation-pipe.config';
import { UsersFiltersDTO } from 'src/infrastructure/user/dtos/admin/users-filters.dto';
import { UpdateUserDTO } from 'src/infrastructure/user/dtos/admin/update-user.dto';
import { CreateOfsDTO } from 'src/infrastructure/ofs/dtos/create.dto';
import { UpdateOfsDTO } from 'src/infrastructure/ofs/dtos/update.dto';
import { CreateUserDTO } from 'src/infrastructure/user/dtos/admin/create-user.dto';
import { CreateDistributorDTO } from 'src/infrastructure/distributor/dtos/create.dto';
import { UpdateDistributorDTO } from 'src/infrastructure/distributor/dtos/update.dto';
import { CreateBrsDiffusionWebsiteDTO } from 'src/infrastructure/brs-diffusion-website/dtos/create.dto';
import { UpdateBrsDiffusionWebsiteDTO } from 'src/infrastructure/brs-diffusion-website/dtos/update.dto';
import { PortalProgramDto } from 'src/infrastructure/brs-diffusion-website/dtos/portal-program.dto';
import { PortalUpdateOfsDto } from 'src/infrastructure/ofs/dtos/portal-update.dto';
import { UpdatePortalLeadNotificationsDto } from 'src/infrastructure/ofs/dtos/update-portal-lead-notifications.dto';
import { UpdatePortalSimulationMetadataDto } from 'src/infrastructure/ofs/dtos/update-portal-simulation-metadata.dto';
import {
  CreateCommercialTransmissionDto,
  UpdateCommercialTransmissionDto,
} from 'src/infrastructure/ofs/dtos/commercial-transmission.dto';
import { AdminLoginDto } from 'src/infrastructure/auth/dtos/login.dto';
import { ForgotPasswordDto } from 'src/infrastructure/auth/dtos/forgot-password.dto';
import { ResetPasswordDto } from 'src/infrastructure/auth/dtos/reset-password.dto';
import { ChangePasswordDto } from 'src/infrastructure/auth/dtos/change-password.dto';
import { BadRequestException } from '@nestjs/common';

describe('admin form submission contracts', () => {
  const validate = (
    value: unknown,
    metatype:
      | typeof UsersFiltersDTO
      | typeof UpdateUserDTO
      | typeof CreateOfsDTO
      | typeof UpdateOfsDTO,
    type: 'body' | 'query' = 'body',
  ) => createValidationPipe().transform(value, { type, metatype });

  it.each([
    ['true', true],
    ['false', false],
    ['', undefined],
  ])('preserves the user status filter %j', async (isActive, expected) => {
    const result = await validate(
      {
        page: '1',
        pageSize: '20',
        search: '',
        role: '',
        ofsId: '',
        sort: 'email',
        isActive,
      },
      UsersFiltersDTO,
      'query',
    );
    expect(result.isActive).toBe(expected);
  });

  it('rejects malformed user status filters', async () => {
    await expect(
      validate({ isActive: 'invalid' }, UsersFiltersDTO, 'query'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it.each([CreateOfsDTO, UpdateOfsDTO])(
    'accepts checked and unchecked OFS checkboxes (%p)',
    async (dto) => {
      const checked = await validate(
        {
          name: 'Mon OFS',
          producesBrs: '',
          isPartner: '',
          regionNames: ['Bretagne'],
          departementNames: ['Finistère'],
          distributorIds: ['seller'],
        },
        dto,
      );
      expect(checked).toMatchObject({ producesBrs: true, isPartner: true });
      const unchecked = await validate({ name: 'Mon OFS' }, dto);
      expect(unchecked.producesBrs).toBeUndefined();
      expect(unchecked.isPartner).toBeUndefined();
    },
  );

  const renderUserForm = (returnTo: string | undefined, self = false) => {
    const handlebars = hbs.handlebars;
    hbs.registerHelper('encodeURIComponent', encodeURIComponent);
    hbs.registerHelper('isEqual', (a, b) => a === b);
    hbs.registerHelper('contains', (a, b) => b.includes(a));
    hbs.registerHelper('formatDateTime', () => '-');
    for (const name of ['breadcrumb', 'page_header', 'alerts/error'])
      hbs.registerPartial(name, '');
    return handlebars.compile(
      readFileSync(
        join(__dirname, '../../../src/views/users/update.hbs'),
        'utf8',
      ),
    )({
      user: {
        id: '11111111-1111-4111-8111-111111111111',
        roles: ['admin'],
        isActive: true,
      },
      form: { email: 'admin@example.fr', role: 'admin', ofsIds: [] },
      roles: [{ value: 'admin', label: 'Admin' }],
      blocks: { emailChange: self },
      returnTo,
    });
  };

  it.each([undefined, '/users?page=2'])(
    'routes user edits through PUT with returnTo=%j',
    (returnTo) => {
      const html = renderUserForm(returnTo);
      const action = html
        .match(/<form id="user-update-form"[^>]*action="([^"]+)"/)![1]
        .replace(/&amp;/g, '&');
      const url = new URL(action, 'https://admin.example.fr');
      expect(url.pathname).toBe('/users/11111111-1111-4111-8111-111111111111');
      expect(url.searchParams.get('_method')).toBe('PUT');
      expect(url.searchParams.get('returnTo')).toBe(returnTo ?? null);
    },
  );

  it('submits the current email when an admin edits their own account', async () => {
    const html = renderUserForm(undefined, true);
    const emailInput = html.match(/<input[^>]*name="email"[^>]*>/)![0];
    expect(emailInput).not.toMatch(/\bdisabled\b/);
    expect(emailInput).toMatch(/\breadonly\b/);
    await expect(
      validate(
        { email: 'admin@example.fr', role: 'admin', distributorId: '' },
        UpdateUserDTO,
      ),
    ).resolves.toMatchObject({ email: 'admin@example.fr' });
  });
});

describe('portal and admin payloads with strict validation', () => {
  const id = '11111111-1111-4111-8111-111111111111';
  const adminProgram = {
    programName: '',
    source: 'https://example.fr/programme',
    address: '10 rue de Paris',
    city: 'Paris',
    inseeCode: '',
    deliveryMonth: '',
    housingType: 'new',
    ofsId: '',
    ofsName: '',
    distributorId: '',
    distributorName: '',
  };
  const transmission = {
    scopeType: 'GEOGRAPHIC',
    inseeCodes: ['75056'],
    departementCodes: ['75'],
    isActive: false,
  };
  const contracts = [
    {
      name: 'admin OFS create',
      dto: CreateOfsDTO,
      payload: {
        name: 'OFS',
        phone: '',
        websiteUrl: '',
        email: '',
        regionNames: ['Bretagne'],
        departementNames: ['Finistère'],
        distributorIds: [id],
        producesBrs: '',
        isPartner: '',
      },
    },
    {
      name: 'admin OFS update',
      dto: UpdateOfsDTO,
      payload: { name: 'OFS', phone: '', websiteUrl: '', email: '' },
    },
    {
      name: 'admin commercialisateur create',
      dto: CreateDistributorDTO,
      payload: { name: 'Vendeur', websiteUrl: 'https://example.fr' },
    },
    {
      name: 'admin commercialisateur update',
      dto: UpdateDistributorDTO,
      payload: { name: 'Vendeur', websiteUrl: 'https://example.fr' },
    },
    {
      name: 'admin user create with one OFS',
      dto: CreateUserDTO,
      payload: {
        email: 'ofs@example.fr',
        role: 'ofs',
        ofsIds: id,
        distributorId: '',
      },
    },
    {
      name: 'admin user update with several OFS',
      dto: UpdateUserDTO,
      payload: {
        email: 'ofs@example.fr',
        role: 'ofs',
        ofsIds: [id],
        distributorId: '',
      },
    },
    {
      name: 'admin programme create with blank optional fields',
      dto: CreateBrsDiffusionWebsiteDTO,
      payload: adminProgram,
    },
    {
      name: 'admin programme update with blank optional fields',
      dto: UpdateBrsDiffusionWebsiteDTO,
      payload: adminProgram,
    },
    {
      name: 'login',
      dto: AdminLoginDto,
      payload: { email: 'ofs@example.fr', password: 'password' },
    },
    {
      name: 'forgot password',
      dto: ForgotPasswordDto,
      payload: { email: 'ofs@example.fr' },
    },
    {
      name: 'reset password',
      dto: ResetPasswordDto,
      payload: { token: 'token', password: 'long-new-password' },
    },
    {
      name: 'change password',
      dto: ChangePasswordDto,
      payload: {
        currentPassword: 'password',
        newPassword: 'long-new-password',
      },
    },
    {
      name: 'portal OFS profile',
      dto: PortalUpdateOfsDto,
      payload: { name: 'OFS', email: '', phone: '', websiteUrl: '' },
    },
    {
      name: 'portal notifications',
      dto: UpdatePortalLeadNotificationsDto,
      payload: { notifications: [{ ofsId: id, frequency: 'none' }] },
    },
    {
      name: 'portal contact metadata',
      dto: UpdatePortalSimulationMetadataDto,
      payload: { action: null, status: null },
    },
    {
      name: 'portal transmission create',
      dto: CreateCommercialTransmissionDto,
      payload: { distributorId: id, ...transmission },
    },
    {
      name: 'portal transmission update',
      dto: UpdateCommercialTransmissionDto,
      payload: transmission,
    },
    {
      name: 'portal programme',
      dto: PortalProgramDto,
      payload: {
        programName: 'Programme',
        source: 'https://example.fr/programme',
        address: '10 rue de Paris',
        city: 'Paris',
        inseeCode: '',
        deliveryMonth: '',
        distributorId: '',
        housingType: 'new',
      },
    },
  ];

  it.each(contracts)('accepts $name fields', async ({ dto, payload }) => {
    await expect(
      createValidationPipe().transform(payload, {
        type: 'body',
        metatype: dto,
      }),
    ).resolves.toBeInstanceOf(dto);
  });

  it.each(contracts)(
    'rejects extra fields on $name',
    async ({ dto, payload }) => {
      await expect(
        createValidationPipe().transform(
          { ...payload, unexpected: 'value' },
          { type: 'body', metatype: dto },
        ),
      ).rejects.toBeInstanceOf(BadRequestException);
    },
  );
});
