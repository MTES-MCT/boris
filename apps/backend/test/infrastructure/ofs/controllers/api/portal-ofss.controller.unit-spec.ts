import { AuditService } from 'src/infrastructure/audit/audit.service';
import { Workbook } from 'exceljs';
import { Request, Response } from 'express';
import { validateSync } from 'class-validator';
import { ExportPortalContactFiltersDto } from 'src/infrastructure/ofs/dtos/portal-contact-filters.dto';
import { PortalContactLineView } from 'src/application/eligibility-simulation/views/portal-contact-line.view';
import { PortalOfssController } from 'src/infrastructure/ofs/controllers/api/portal-ofss.controller';

describe('PortalOfssController CSV export', () => {
  const controller = Object.create(
    PortalOfssController.prototype,
  ) as PortalOfssController;
  const escapeCsvValue = (
    controller as unknown as {
      escapeCsvValue(value: string): string;
    }
  ).escapeCsvValue.bind(controller);

  it.each(['=1+1', '+1+1', '-1+1', '@SUM(A1:A2)', '\t=1+1', '\r=1+1'])(
    'neutralizes spreadsheet formula prefix in %j',
    (value) => {
      const neutralized = `'${value}`;
      const expected = value.startsWith('\r')
        ? `"${neutralized}"`
        : neutralized;

      expect(escapeCsvValue(value)).toBe(expected);
    },
  );

  it('neutralizes formulas before applying CSV escaping', () => {
    expect(escapeCsvValue('=HYPERLINK("https://example.test", "click")')).toBe(
      `"'=HYPERLINK(""https://example.test"", ""click"")"`,
    );
  });

  it('keeps ordinary CSV values unchanged', () => {
    expect(escapeCsvValue('Jean Dupont')).toBe('Jean Dupont');
    expect(escapeCsvValue('Dupont, Jean')).toBe('"Dupont, Jean"');
  });
});

describe('PortalOfssController OFS export formats', () => {
  const ofs = { id: 'ofs-1', departements: [{ id: 'department-1' }] };
  const filters = {
    startDate: '2026-01-01',
    endDate: '2026-11-25',
    contact: 'Émilie',
    location: '01',
  };
  const line = Object.assign(
    new PortalContactLineView({} as PortalContactLineView),
    {
      locationId: '11111111-1111-4111-8111-111111111111',
      simulationId: '22222222-2222-4222-8222-222222222222',
      submittedAt: new Date('2026-11-24T12:00:00.000Z'),
      fullName: 'Émilie, "Martin"',
      email: 'emilie@example.test',
      phone: '0102030405',
      city: 'Bourg-en-Bresse',
      departementCode: '01',
      householdSize: 2,
      hasDisability: false,
      propertySituation: "Locataire d'un logement privé",
      housingType: 'T3',
      contribution: 0,
      taxableIncome: 42000,
      resources: 3000,
    },
  );
  let controller: PortalOfssController;
  let execute: jest.Mock;
  let record: jest.SpyInstance;
  let response: Response;
  let setHeader: jest.Mock;
  const req = { user: { roles: [], ofss: [ofs] } } as unknown as Request;

  beforeEach(() => {
    record = jest
      .spyOn(AuditService.prototype, 'record')
      .mockResolvedValue(undefined);
    execute = jest.fn().mockResolvedValue([line]);
    controller = Object.assign(Object.create(PortalOfssController.prototype), {
      ofsRepository: {
        manager: { connection: {} },
        findOne: jest.fn().mockResolvedValue(ofs),
      },
      exportPortalContactLinesUsecase: { execute },
    });
    setHeader = jest.fn();
    response = { setHeader, send: jest.fn() } as unknown as Response;
  });

  async function exportLines(format?: 'csv' | 'xlsx') {
    await controller.exportEligibilitySimulations(
      ofs.id,
      filters.startDate,
      filters.endDate,
      req,
      response,
      { ...filters, format },
    );
    return (response.send as jest.Mock).mock.calls[0][0] as Buffer;
  }

  it('records the exact exported references without copying household values', async () => {
    await exportLines();
    expect(record).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: 'contacts.export_released',
        ofsId: ofs.id,
        resources: [
          {
            resourceType: 'contact_line',
            resourceId: line.locationId,
            simulationId: line.simulationId,
            ofsId: ofs.id,
            distributorId: undefined,
          },
        ],
      }),
    );
    const event = record.mock.calls[1][0];
    expect(JSON.stringify(event)).not.toContain('emilie@example.test');
    expect(JSON.stringify(event)).not.toContain('Émilie');
  });

  it('does not release an export if its audit write fails', async () => {
    record = jest
      .spyOn(AuditService.prototype, 'record')
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('audit unavailable'));
    await expect(exportLines()).rejects.toThrow('audit unavailable');
    expect(response.send).not.toHaveBeenCalled();
  });

  it('keeps CSV as the default with the existing content and filters', async () => {
    const content = await exportLines();
    expect(content.toString('utf8')).toBe(
      'date,contact,email,telephone,ville,departement,foyer,handicap,projet,typeLogement,apport,revenusImposables,ressources\n' +
        '2026-11-24T12:00:00.000Z,"Émilie, ""Martin""",emilie@example.test,0102030405,Bourg-en-Bresse,01,2,Non,Locataire d\'un logement privé,T3,0,42000,3000\n',
    );
    expect(setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'text/csv; charset=utf-8',
    );
    expect(setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="simulations-ofs-1-2026-01-01-2026-11-25.csv"',
    );
    expect(execute).toHaveBeenCalledWith({
      ...filters,
      ofsId: ofs.id,
      departementIds: ['department-1'],
    });
  });

  it('exports a real workbook with the same values and preserves leading zeros', async () => {
    const content = await exportLines('xlsx');
    const workbook = new Workbook();
    await workbook.xlsx.load(content);
    expect(workbook.worksheets).toHaveLength(1);
    const sheet = workbook.worksheets[0];
    expect(sheet.getRow(1).values).toEqual([
      undefined,
      'date',
      'contact',
      'email',
      'telephone',
      'ville',
      'departement',
      'foyer',
      'handicap',
      'projet',
      'typeLogement',
      'apport',
      'revenusImposables',
      'ressources',
    ]);
    expect(sheet.getRow(2).values).toEqual([
      undefined,
      '2026-11-24T12:00:00.000Z',
      'Émilie, "Martin"',
      'emilie@example.test',
      '0102030405',
      'Bourg-en-Bresse',
      '01',
      '2',
      'Non',
      "Locataire d'un logement privé",
      'T3',
      '0',
      '42000',
      '3000',
    ]);
    expect(setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    expect(setHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename="simulations-ofs-1-2026-01-01-2026-11-25.xlsx"',
    );
    expect(execute).toHaveBeenCalledWith({
      ...filters,
      ofsId: ofs.id,
      departementIds: ['department-1'],
    });
  });

  it('stores formula-like contact data as text in Excel', async () => {
    execute.mockResolvedValue([
      { ...line, fullName: '=1+1', phone: '+33102030405' },
    ]);
    const workbook = new Workbook();
    await workbook.xlsx.load(await exportLines('xlsx'));
    const sheet = workbook.worksheets[0];
    expect(sheet.getCell('B2').value).toBe('=1+1');
    expect(sheet.getCell('D2').value).toBe('+33102030405');
  });

  it('exports the headers even when no contacts match', async () => {
    execute.mockResolvedValue([]);
    const workbook = new Workbook();
    await workbook.xlsx.load(await exportLines('xlsx'));
    expect(workbook.worksheets[0].rowCount).toBe(1);
    expect(workbook.worksheets[0].columnCount).toBe(13);
  });

  it.each([undefined, 'csv', 'xlsx'])('accepts format %s', (format) => {
    expect(
      validateSync(
        Object.assign(new ExportPortalContactFiltersDto(), { format }),
      ),
    ).toHaveLength(0);
  });

  it('rejects an unsupported format', () => {
    expect(
      validateSync(
        Object.assign(new ExportPortalContactFiltersDto(), { format: 'pdf' }),
      ),
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'format' })]),
    );
  });
});
