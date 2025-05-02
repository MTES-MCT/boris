import { Test, TestingModule } from '@nestjs/testing';
import { SaveOfsUsecase } from 'src/application/ofs/save.use-case';
import { mockOfsRepository, ofs1 } from 'test/mocks/ofs';

describe('SaveOfsUsecase', () => {
  let useCase: SaveOfsUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaveOfsUsecase,
        {
          provide: 'OfsRepositoryInterface',
          useValue: mockOfsRepository,
        },
      ],
    }).compile();

    useCase = module.get<SaveOfsUsecase>(SaveOfsUsecase);
  });

  it('should save an ofs and return its data', async () => {
    mockOfsRepository.save.mockReturnValue(ofs1);

    const result = await useCase.execute(ofs1);

    expect(result).toMatchObject(ofs1);
    expect(mockOfsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.save).toHaveBeenCalledWith(ofs1);
  });
});
