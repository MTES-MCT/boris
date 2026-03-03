/**
 * Options pour l'insertion d'une ligne dans un Google Sheet.
 * range peut être le nom de l'onglet (ex: "Sheet1") ou une plage A1 (ex: "Sheet1!A:D").
 */
export interface AppendRowOptions {
  /** Nom de l'onglet ou plage A1 (ex: "Sheet1" ou "Sheet1!A:D") */
  range: string;
  /** Option d'interprétation des valeurs: USER_ENTERED (formules/dates) ou RAW */
  valueInputOption?: 'RAW' | 'USER_ENTERED';
}

export interface GoogleSheetsServiceInterface {
  /**
   * Insère une ou plusieurs lignes à la fin du sheet.
   * @param spreadsheetId ID du document (dans l'URL du sheet)
   * @param options range (nom d'onglet ou A1) et valueInputOption
   * @param values Tableau de lignes, chaque ligne = tableau de cellules
   */
  appendRows(
    spreadsheetId: string,
    options: AppendRowOptions,
    values: unknown[][],
  ): Promise<{ updatedCells: number; updatedRows: number }>;
}
