import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DatagouvRepositoryInterface } from 'src/domain/datagouv/datagouv.repository.interface';

@Injectable()
export class DatagouvRepository implements DatagouvRepositoryInterface {
  constructor() {}

  private readonly baseUrl = 'https://www.data.gouv.fr/api/1';
  private readonly schemaName = 'etalab/schema-impact-service-public-numerique';

  public async uploadCsvFile(
    filePath: string,
    apiKey: string,
    datasetId: string,
  ): Promise<void> {
    console.log('Upload des statistiques mensuelles...');

    const fileBuffer = await fs.promises.readFile(filePath);
    const fileName = path.basename(filePath);

    const blob = new Blob([new Uint8Array(fileBuffer)], { type: 'text/csv' });
    const formData = new FormData();
    formData.append('file', blob, fileName);

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

    const resource = await response.json();

    if (!response.ok) {
      throw new InternalServerErrorException(
        `Failed to upload CSV file: ${resource.message || 'Unknown error'}`,
      );
    }

    const schemaResponse = await fetch(
      `${this.baseUrl}/datasets/${datasetId}/resources/${resource.id}/`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({
          schema: {
            name: this.schemaName,
            version: '0.5.0',
          },
        }),
      },
    );

    if (!schemaResponse.ok) {
      const err = await schemaResponse.text();

      throw new InternalServerErrorException(
        `Schema association failed: ${err}`,
      );
    }

    console.log("Fin de l'upload des statistiques mensuelles...");
  }
}
