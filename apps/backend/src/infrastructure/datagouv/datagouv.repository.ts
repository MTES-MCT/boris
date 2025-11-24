import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DatagouvRepositoryInterface } from 'src/domain/datagouv/datagouv.repository.interface';

@Injectable()
export class DatagouvRepository implements DatagouvRepositoryInterface {
  constructor() {}

  private readonly baseUrl = 'https://www.data.gouv.fr/api/1/';

  public async uploadCsvFile(
    filePath: string,
    apiKey: string,
    datasetId: string,
  ): Promise<void> {
    const formData = new FormData();
    formData.append('file', filePath);

    const response = await fetch(
      `${this.baseUrl}/datasets/${datasetId}/upload/`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-Api-Key': apiKey,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new InternalServerErrorException('Failed to upload CSV file');
    }
  }
}
