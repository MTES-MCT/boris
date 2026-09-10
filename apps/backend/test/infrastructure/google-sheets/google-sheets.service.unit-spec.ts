import { GoogleSheetsService } from 'src/infrastructure/google-sheets/google-sheets.service';

describe('GoogleSheetsService', () => {
  it('stores values as raw text by default', async () => {
    const previousInsertSetting = process.env.GOOGLE_SHEETS_INSERT;
    delete process.env.GOOGLE_SHEETS_INSERT;
    const append = jest.fn().mockResolvedValue({
      data: { updates: { updatedCells: 1, updatedRows: 1 } },
    });
    const service = new GoogleSheetsService();

    (service as unknown as { sheets: unknown }).sheets = {
      spreadsheets: { values: { append } },
    };

    try {
      await service.appendRows('spreadsheet-id', { range: 'Sheet1' }, [
        ['=1+1'],
      ]);
    } finally {
      if (previousInsertSetting === undefined) {
        delete process.env.GOOGLE_SHEETS_INSERT;
      } else {
        process.env.GOOGLE_SHEETS_INSERT = previousInsertSetting;
      }
    }

    expect(append).toHaveBeenCalledWith(
      expect.objectContaining({
        valueInputOption: 'RAW',
        requestBody: { values: [['=1+1']] },
      }),
    );
  });
});
