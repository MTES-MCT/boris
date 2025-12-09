import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { OfsRepository } from 'src/infrastructure/ofs/ofs.repository';
import { mockOfsRepository, ofs1 } from 'test/mocks/integration/ofs';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all ofs with isPartner filter', async () => {
    const queryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockResolvedValue([[ofs1], 1]),
    };
    mockOfsRepository.createQueryBuilder.mockReturnValue(queryBuilder);

    const result = await ofsRepository.findAll(
      { pageSize: 10, page: 1 },
      { isPartner: true },
    );

    expect(result).toEqual([[ofs1], 1]);
    expect(queryBuilder.where).toHaveBeenCalledWith(
      'ofs.isPartner = :isPartner',
      { isPartner: true },
    );
    expect(queryBuilder.skip).toHaveBeenCalledWith(0);
    expect(queryBuilder.take).toHaveBeenCalledWith(10);
    expect(queryBuilder.orderBy).toHaveBeenCalledWith('ofs.createdAt', 'DESC');
    expect(queryBuilder.getManyAndCount).toHaveBeenCalledTimes(1);
  });

  it('should save an ofs and return its data', async () => {
    mockOfsRepository.save.mockResolvedValue(ofs1);

    const result = await ofsRepository.save(ofs1);

    expect(result).toMatchObject(ofs1);
    expect(mockOfsRepository.save).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.save).toHaveBeenCalledWith(ofs1);
  });

  it('should find an ofs by id', async () => {
    mockOfsRepository.findOne.mockResolvedValue(ofs1);

    const result = await ofsRepository.findById('1234');

    expect(result).toMatchObject(ofs1);
    expect(mockOfsRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1234' },
      relations: ['departements', 'regions', 'distributors'],
    });
  });

  it('should delete an ofs', async () => {
    mockOfsRepository.delete.mockResolvedValue({ affected: 1 });

    await ofsRepository.delete('1234');

    expect(mockOfsRepository.delete).toHaveBeenCalledTimes(1);
    expect(mockOfsRepository.delete).toHaveBeenCalledWith('1234');
  });
});
