import { Test, TestingModule } from '@nestjs/testing';
import { FindOfsByIdUsecase } from 'src/application/ofs/usecases/findById.usecase';
import { NotFoundException } from '@nestjs/common';
import { ofs1, mockOfsRepository } from 'test/mocks/integration/ofs';
import { OfsView } from 'src/application/ofs/views/ofs.view';

describe('FindOfsByIdUsecase', () => {
  let useCase: FindOfsByIdUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOfsByIdUsecase,
        {
          provide: 'OfsRepositoryInterface',
          useValue: mockOfsRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindOfsByIdUsecase>(FindOfsByIdUsecase);
  });

  it('should find an existing OFS by id', async () => {
    mockOfsRepository.findById.mockResolvedValue(ofs1);

    const expectedResult = new OfsView(
      ofs1.id,
      ofs1.name,
      ofs1.websiteUrl,
      ofs1.phone,
      ofs1.email,
      ofs1.producesBrs,
      ofs1.isPartner,
      ofs1.departements.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
      })),
      ofs1.regions.map((r) => ({
        id: r.id,
        name: r.name,
      })),
      ofs1.distributors.map((d) => ({
        id: d.id,
        name: d.name,
        websiteUrl: d.websiteUrl,
      })),
    );

    const result = await useCase.execute({ id: '1234' });

    expect(result).toEqual(expectedResult);
    expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.findById).toHaveBeenCalledWith('1234');
  });

  it('should throw NotFoundException when OFS does not exist', async () => {
    mockOfsRepository.findById.mockResolvedValue(null);

    try {
      await useCase.execute({ id: '1234' });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockOfsRepository.findById).toHaveBeenCalledWith('1234');
    }
  });
});
