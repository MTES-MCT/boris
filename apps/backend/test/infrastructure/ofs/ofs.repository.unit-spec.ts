import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { OfsRepository } from 'src/infrastructure/ofs/ofs.repository';
import { mockOfsRepository, ofs1 } from 'test/mocks/ofs';

describe('OfsRepository', () => {
  let ofsRepository: OfsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OfsRepository,
        {
          provide: getRepositoryToken(OfsEntity),
          useValue: mockOfsRepository,
        },
      ],
    }).compile();

    ofsRepository = module.get<OfsRepository>(OfsRepository);
  });

  it('should save an ofs and return its data', async () => {
    mockOfsRepository.save.mockResolvedValue(ofs1);

    const result = await ofsRepository.save(ofs1);

    expect(result).toMatchObject(ofs1);
    expect(mockOfsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.save).toHaveBeenCalledWith(ofs1);
  });
});
