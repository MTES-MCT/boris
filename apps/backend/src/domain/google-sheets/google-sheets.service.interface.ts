export interface AppendRowOptions {
  range: string;
  valueInputOption?: 'RAW' | 'USER_ENTERED';
}

export interface GoogleSheetsServiceInterface {
  appendRows(
    spreadsheetId: string,
    options: AppendRowOptions,
    values: unknown[][],
  ): Promise<{ updatedCells: number; updatedRows: number }>;
}
