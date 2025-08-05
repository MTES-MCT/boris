import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { BrsDiffusionWebsiteRepository } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.repository';
import {
  mockedBrsDiffusionWebsite,
  mockedBrsDiffusionWebsiteRepository,
} from 'test/mocks/integration/brs-diffusion-website';

describe('BrsDiffusionWebsiteRepository', () => {
  let brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrsDiffusionWebsiteRepository,
        {
          provide: getRepositoryToken(BrsDiffusionWebsiteEntity),
          useValue: mockedBrsDiffusionWebsiteRepository,
        },
      ],
    }).compile();

    brsDiffusionWebsiteRepository = module.get<BrsDiffusionWebsiteRepository>(
      BrsDiffusionWebsiteRepository,
    );
  });

  it('should save a brs diffusion website and return its data', async () => {
    mockedBrsDiffusionWebsiteRepository.save.mockResolvedValue(
      mockedBrsDiffusionWebsite,
    );

    const result = await brsDiffusionWebsiteRepository.save(
      mockedBrsDiffusionWebsite,
    );

    expect(result).toMatchObject(mockedBrsDiffusionWebsite);
    expect(mockedBrsDiffusionWebsiteRepository.save).toHaveBeenCalledTimes(1);
    expect(mockedBrsDiffusionWebsiteRepository.save).toHaveBeenCalledWith(
      mockedBrsDiffusionWebsite,
    );
  });
});
