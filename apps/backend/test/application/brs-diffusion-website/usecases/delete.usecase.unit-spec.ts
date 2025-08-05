import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/delete.usecase';
import {
  mockedBrsDiffusionWebsite,
  mockedBrsDiffusionWebsiteRepository,
} from 'test/mocks/integration/brs-diffusion-website';
import { BrsDiffusionWebsiteView } from 'src/application/brs-diffusion-website/views/brs-diffusion-website.view';

describe('DeleteBrsDiffusionWebsiteUsecase', () => {
  let useCase: DeleteBrsDiffusionWebsiteUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteBrsDiffusionWebsiteUsecase,
        {
          provide: 'BrsDiffusionWebsiteRepositoryInterface',
          useValue: mockedBrsDiffusionWebsiteRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteBrsDiffusionWebsiteUsecase>(
      DeleteBrsDiffusionWebsiteUsecase,
    );
  });

  it('should delete an existing brs diffusion website', async () => {
    mockedBrsDiffusionWebsiteRepository.findById.mockResolvedValue(
      mockedBrsDiffusionWebsite,
    );
    mockedBrsDiffusionWebsiteRepository.delete.mockResolvedValue(undefined);

    const expectedResult = new BrsDiffusionWebsiteView(
      mockedBrsDiffusionWebsite.id,
      mockedBrsDiffusionWebsite.source,
      mockedBrsDiffusionWebsite.distributorName,
      mockedBrsDiffusionWebsite.ofsName,
      mockedBrsDiffusionWebsite.city,
      mockedBrsDiffusionWebsite.zipcode,
      mockedBrsDiffusionWebsite.address,
      mockedBrsDiffusionWebsite.inseeCode,
      mockedBrsDiffusionWebsite.latitude,
      mockedBrsDiffusionWebsite.longitude,
      {
        id: mockedBrsDiffusionWebsite.region.id,
        name: mockedBrsDiffusionWebsite.region.name,
      },
      {
        id: mockedBrsDiffusionWebsite.departement.id,
        name: mockedBrsDiffusionWebsite.departement.name,
        code: mockedBrsDiffusionWebsite.departement.code,
      },
    );

    const result = await useCase.execute({ id: '1234' });

    expect(result).toEqual(expectedResult);

    expect(mockedBrsDiffusionWebsiteRepository.findById).toHaveBeenCalledTimes(
      1,
    );
    expect(mockedBrsDiffusionWebsiteRepository.findById).toHaveBeenCalledWith(
      '1234',
    );
    expect(mockedBrsDiffusionWebsiteRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockedBrsDiffusionWebsiteRepository.delete).toHaveBeenCalledWith(
      '1234',
    );
  });

  it('should throw NotFoundException when brs diffusion website does not exist', async () => {
    mockedBrsDiffusionWebsiteRepository.findById.mockResolvedValue(null);

    try {
      await useCase.execute({ id: '1234' });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(
        mockedBrsDiffusionWebsiteRepository.findById,
      ).toHaveBeenCalledTimes(1);
      expect(mockedBrsDiffusionWebsiteRepository.findById).toHaveBeenCalledWith(
        '1234',
      );
      expect(mockedBrsDiffusionWebsiteRepository.delete).not.toHaveBeenCalled();
    }
  });
});
