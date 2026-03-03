import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import type {
  AppendRowOptions,
  GoogleSheetsServiceInterface,
} from 'src/domain/google-sheets/google-sheets.service.interface';

@Injectable()
export class GoogleSheetsService implements GoogleSheetsServiceInterface {
  private sheets: sheets_v4.Sheets | null = null;

  private async getSheetsClient(): Promise<sheets_v4.Sheets> {
    if (this.sheets) return this.sheets;

    const raw = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
    if (!raw) {
      throw new Error(
        'Google Sheets credentials missing: set GOOGLE_APPLICATION_CREDENTIALS in .env (JSON du compte de service, minifié sur une ligne)',
      );
    }

    const credentials = JSON.parse(raw) as {
      client_email: string;
      private_key: string;
    };
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    });
    const authClient = await auth.getClient();
    this.sheets = google.sheets({ version: 'v4', auth: authClient as any });
    return this.sheets;
  }

  public async appendRows(
    spreadsheetId: string,
    options: AppendRowOptions,
    values: unknown[][],
  ): Promise<{ updatedCells: number; updatedRows: number }> {
    const range = options.range.includes('!')
      ? options.range
      : `${options.range}!A:ZZ`;
    const valueInputOption = options.valueInputOption ?? 'USER_ENTERED';

    const sheets = await this.getSheetsClient();
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption,
      requestBody: {
        values: values.map((row) => row.map((cell) => String(cell ?? ''))),
      },
    });

    const updatedCells = res.data.updates?.updatedCells ?? 0;
    const updatedRows = res.data.updates?.updatedRows ?? 0;
    return { updatedCells, updatedRows };
  }
}
