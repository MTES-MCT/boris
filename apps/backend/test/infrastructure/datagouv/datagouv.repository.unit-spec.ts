import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { DatagouvRepository } from 'src/infrastructure/datagouv/datagouv.repository';

global.fetch = jest.fn();

describe('DatagouvRepository', () => {
  let datagouvRepository: DatagouvRepository;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatagouvRepository],
    }).compile();

    datagouvRepository = module.get<DatagouvRepository>(DatagouvRepository);
    mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    jest.clearAllMocks();
  });

  describe('uploadCsvFile', () => {
    const filePath = '/path/to/file.csv';
    const apiKey = 'test-api-key-123';
    const datasetId = 'test-dataset-id-456';
    const expectedUrl =
      'https://www.data.gouv.fr/api/1//datasets/test-dataset-id-456/upload/';

    it('should upload CSV file successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as unknown as Response);

      await datagouvRepository.uploadCsvFile(filePath, apiKey, datasetId);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'X-Api-Key': apiKey,
          },
        }),
      );

      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[1]?.body).toBeInstanceOf(FormData);
    });

    it('should throw InternalServerErrorException when upload fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
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
      } as unknown as Response);

      await expect(
        datagouvRepository.uploadCsvFile(filePath, apiKey, datasetId),
      ).rejects.toThrow('Failed to upload CSV file');

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should call fetch with correct URL for different dataset IDs', async () => {
      const differentDatasetId = 'another-dataset-id';
      const expectedUrlForDifferentId =
        'https://www.data.gouv.fr/api/1//datasets/another-dataset-id/upload/';

      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as unknown as Response);

      await datagouvRepository.uploadCsvFile(
        filePath,
        apiKey,
        differentDatasetId,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrlForDifferentId,
        expect.any(Object),
      );
    });

    it('should call fetch with correct API key in headers', async () => {
      const differentApiKey = 'different-api-key';
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as unknown as Response);

      await datagouvRepository.uploadCsvFile(
        filePath,
        differentApiKey,
        datasetId,
      );

      expect(mockFetch).toHaveBeenCalledWith(
        expectedUrl,
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Api-Key': differentApiKey,
          }),
        }),
      );
    });

    it('should append file to FormData', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as unknown as Response);

      await datagouvRepository.uploadCsvFile(filePath, apiKey, datasetId);

      const callArgs = mockFetch.mock.calls[0];
      const formData = callArgs[1]?.body as FormData;

      expect(formData).toBeInstanceOf(FormData);
    });
  });
});
