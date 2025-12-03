import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { DatagouvRepository } from 'src/infrastructure/datagouv/datagouv.repository';
import * as fs from 'fs';

global.fetch = jest.fn();

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe('DatagouvRepository', () => {
  let datagouvRepository: DatagouvRepository;
  let mockFetch: jest.MockedFunction<typeof fetch>;
  let mockReadFile: jest.MockedFunction<typeof fs.promises.readFile>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatagouvRepository],
    }).compile();

    datagouvRepository = module.get<DatagouvRepository>(DatagouvRepository);
    mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    mockReadFile = fs.promises.readFile as jest.MockedFunction<
      typeof fs.promises.readFile
    >;
    jest.clearAllMocks();

    // Mock default file read
    mockReadFile.mockResolvedValue(Buffer.from('test,data\n1,2'));
  });

  describe('uploadCsvFile', () => {
    const filePath = '/path/to/file.csv';
    const apiKey = 'test-api-key-123';
    const datasetId = 'test-dataset-id-456';
    const resourceId = 'resource-id-789';
    const expectedUploadUrl =
      'https://www.data.gouv.fr/api/1/datasets/test-dataset-id-456/upload/';
    const expectedSchemaUrl = `https://www.data.gouv.fr/api/1/datasets/${datasetId}/resources/${resourceId}/`;

    it('should upload CSV file and associate schema successfully', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: resourceId }),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
        } as unknown as Response);

      await datagouvRepository.uploadCsvFile(filePath, apiKey, datasetId);

      expect(mockReadFile).toHaveBeenCalledWith(filePath);
      expect(mockFetch).toHaveBeenCalledTimes(2);

      // First call: upload
      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        expectedUploadUrl,
        expect.objectContaining({
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'X-Api-Key': apiKey,
          },
        }),
      );

      const uploadCallArgs = mockFetch.mock.calls[0];
      expect(uploadCallArgs[1]?.body).toBeInstanceOf(FormData);

      // Second call: schema association
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        expectedSchemaUrl,
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey,
          },
        }),
      );
    });

    it('should throw InternalServerErrorException when upload fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ message: 'Upload failed' }),
      } as unknown as Response);

      await expect(
        datagouvRepository.uploadCsvFile(filePath, apiKey, datasetId),
      ).rejects.toThrow(InternalServerErrorException);

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException with correct message when upload fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({ message: 'Upload failed' }),
      } as unknown as Response);

      await expect(
        datagouvRepository.uploadCsvFile(filePath, apiKey, datasetId),
      ).rejects.toThrow('Failed to upload CSV file');

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should call fetch with correct URL for different dataset IDs', async () => {
      const differentDatasetId = 'another-dataset-id';
      const expectedUrlForDifferentId =
        'https://www.data.gouv.fr/api/1/datasets/another-dataset-id/upload/';

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: resourceId }),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
        } as unknown as Response);

      await datagouvRepository.uploadCsvFile(
        filePath,
        apiKey,
        differentDatasetId,
      );

      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        expectedUrlForDifferentId,
        expect.any(Object),
      );
    });

    it('should call fetch with correct API key in headers', async () => {
      const differentApiKey = 'different-api-key';
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: resourceId }),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
        } as unknown as Response);

      await datagouvRepository.uploadCsvFile(
        filePath,
        differentApiKey,
        datasetId,
      );

      expect(mockFetch).toHaveBeenNthCalledWith(
        1,
        expectedUploadUrl,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Api-Key': differentApiKey,
          }),
        }),
      );

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        expectedSchemaUrl,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Api-Key': differentApiKey,
          }),
        }),
      );
    });

    it('should append file to FormData', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: resourceId }),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
        } as unknown as Response);

      await datagouvRepository.uploadCsvFile(filePath, apiKey, datasetId);

      const callArgs = mockFetch.mock.calls[0];
      const formData = callArgs[1]?.body as FormData;

      expect(formData).toBeInstanceOf(FormData);
    });

    it('should throw InternalServerErrorException when schema association fails', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: resourceId }),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: () => Promise.resolve('Schema association error'),
        } as unknown as Response);

      await expect(
        datagouvRepository.uploadCsvFile(filePath, apiKey, datasetId),
      ).rejects.toThrow('Schema association failed');

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should send correct schema data in PUT request', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ id: resourceId }),
        } as unknown as Response)
        .mockResolvedValueOnce({
          ok: true,
        } as unknown as Response);

      await datagouvRepository.uploadCsvFile(filePath, apiKey, datasetId);

      const schemaCallArgs = mockFetch.mock.calls[1];
      expect(schemaCallArgs[1]?.body).toBe(
        JSON.stringify({
          schema: {
            name: 'etalab/schema-impact-service-public-numerique',
            version: '0.5.0',
          },
        }),
      );
    });
  });
});
