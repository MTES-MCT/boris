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
