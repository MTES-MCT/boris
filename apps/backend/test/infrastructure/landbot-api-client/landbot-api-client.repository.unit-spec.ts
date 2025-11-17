import { Test, TestingModule } from '@nestjs/testing';
import { LandbotApiClientRepository } from 'src/infrastructure/landbot-api-client/landbot-api-client.repository';
import {
  mockedLandbotApiClientListCustomersResponse,
  mockedLandbotApiClientListCustomersResponseMultiple,
  mockedLandbotApiClientListCustomersResponseEmpty,
  mockedLandbotApiClientListCustomersResponseMinimal,
} from 'test/mocks/integration/landbot-api-client';

global.fetch = jest.fn();

describe('LandbotApiClientRepository', () => {
  let repository: LandbotApiClientRepository;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  const originalEnv = process.env;

  beforeEach(async () => {
    process.env = {
      ...originalEnv,
      LANDBOT_API_URL: 'https://api.landbot.example.com',
      LANDBOT_API_TOKEN: 'test-token-123',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [LandbotApiClientRepository],
    }).compile();

    repository = module.get<LandbotApiClientRepository>(
      LandbotApiClientRepository,
    );

    mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should list customers with default parameters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue(mockedLandbotApiClientListCustomersResponse),
    } as unknown as Response);

    const result = await repository.listCustomers();

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.landbot.example.com/customers/?offset=0&limit=25',
      {
        headers: {
          Authorization: 'Token test-token-123',
        },
      },
    );
    expect(result).toEqual(mockedLandbotApiClientListCustomersResponse);
  });

  it('should list customers with custom offset and limit', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue(mockedLandbotApiClientListCustomersResponseEmpty),
    } as unknown as Response);

    const offset = 50;
    const limit = 10;

    const result = await repository.listCustomers(offset, limit);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.landbot.example.com/customers/?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: 'Token test-token-123',
        },
      },
    );
    expect(result).toEqual(mockedLandbotApiClientListCustomersResponseEmpty);
  });

  it('should return response with multiple customers', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue(mockedLandbotApiClientListCustomersResponseMultiple),
    } as unknown as Response);

    const result = await repository.listCustomers(0, 25);

    expect(result).toEqual(mockedLandbotApiClientListCustomersResponseMultiple);
    expect(result.customers).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it('should return response with optional fields undefined', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue(mockedLandbotApiClientListCustomersResponseMinimal),
    } as unknown as Response);

    const result = await repository.listCustomers();

    expect(result).toEqual(mockedLandbotApiClientListCustomersResponseMinimal);
    expect(result.customers[0].eligibilite1).toBeUndefined();
    expect(result.customers[0].situation_immo).toBeUndefined();
    expect(result.customers[0].connaissancebrs).toBeUndefined();
    expect(result.customers[0].departement).toBeUndefined();
    expect(result.customers[0].ville_souhaitee).toBeUndefined();
  });

  it('should use correct authorization header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest
        .fn()
        .mockResolvedValue(mockedLandbotApiClientListCustomersResponseEmpty),
    } as unknown as Response);

    await repository.listCustomers();

    expect(mockFetch).toHaveBeenCalledWith(expect.any(String), {
      headers: {
        Authorization: 'Token test-token-123',
      },
    });
  });
});
