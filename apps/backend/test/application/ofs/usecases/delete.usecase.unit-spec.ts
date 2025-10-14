import { Test, TestingModule } from '@nestjs/testing';
import { DeleteOfsUsecase } from 'src/application/ofs/usecases/delete.usecase';
import { NotFoundException } from '@nestjs/common';
import { ofs1, mockOfsRepository } from 'test/mocks/integration/ofs';
import { OfsView } from 'src/application/ofs/views/ofs.view';

describe('DeleteOfsUsecase', () => {
  let useCase: DeleteOfsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteOfsUsecase,
        {
          provide: 'OfsRepositoryInterface',
          useValue: mockOfsRepository,
        },
      ],
    }).compile();

    useCase = module.get<DeleteOfsUsecase>(DeleteOfsUsecase);
  });

  it('should delete an existing OFS', async () => {
    mockOfsRepository.findById.mockResolvedValue(ofs1);
    mockOfsRepository.delete.mockResolvedValue(undefined);

    const expectedResult = new OfsView(
      ofs1.id,
      ofs1.name,
      null,
      null,
      null,
      null,
      [],
      [],
      [],
    );

    const result = await useCase.execute({ id: '1234' });

    expect(result).toEqual(expectedResult);

    expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.findById).toHaveBeenCalledWith('1234');
    expect(mockOfsRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.delete).toHaveBeenCalledWith('1234');
  });

  it('should throw NotFoundException when OFS does not exist', async () => {
    mockOfsRepository.findById.mockResolvedValue(null);

    try {
      await useCase.execute({ id: '1234' });
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(mockOfsRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockOfsRepository.findById).toHaveBeenCalledWith('1234');
      expect(mockOfsRepository.delete).not.toHaveBeenCalled();
    }
  });
});
