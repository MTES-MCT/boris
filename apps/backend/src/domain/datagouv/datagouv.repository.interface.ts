export interface DatagouvRepositoryInterface {
  uploadCsvFile(
    filePath: string,
    apiKey: string,
    datasetId: string,
  ): Promise<void>;
}
