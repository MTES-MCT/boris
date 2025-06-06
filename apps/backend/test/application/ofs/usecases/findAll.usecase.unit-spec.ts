import { Test, TestingModule } from '@nestjs/testing';
import { FindAllOfssUsecase } from 'src/application/ofs/usecases/findAll.usecase';
import { OfsView } from 'src/application/ofs/views/ofs.view';
import {
  DEFAULT_PAGINATION,
  Pagination,
} from 'src/application/pagination/pagination';
import { ofs1, ofs2, mockOfsRepository } from 'test/mocks/integration/ofs';

describe('FindAllOfssUsecase', () => {
  let useCase: FindAllOfssUsecase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllOfssUsecase,
        {
          provide: 'OfsRepositoryInterface',
          useValue: mockOfsRepository,
        },
      ],
    }).compile();

    useCase = module.get<FindAllOfssUsecase>(FindAllOfssUsecase);
  });

  it('should return all OFS', async () => {
    mockOfsRepository.findAll.mockReturnValue([[ofs1, ofs2], 2]);

    const expectedResult = new Pagination(
      [
        new OfsView(
          ofs1.id,
          ofs1.name,
          ofs1.websiteUrl,
          ofs1.phone,
          ofs1.email,
          ofs1.departements.map((d) => ({
            id: d.id,
            name: d.name,
            code: d.code,
          })),
          ofs1.regions.map((r) => ({ id: r.id, name: r.name })),
          ofs1.distributors.map((dis) => ({
            id: dis.id,
            name: dis.name,
            websiteUrl: dis.websiteUrl,
          })),
        ),
        new OfsView(
          ofs2.id,
          ofs2.name,
          ofs2.websiteUrl,
          ofs2.phone,
          ofs2.email,
          ofs2.departements.map((d) => ({
            id: d.id,
            name: d.name,
            code: d.code,
          })),
          ofs2.regions.map((r) => ({ id: r.id, name: r.name })),
          ofs2.distributors.map((dis) => ({
            id: dis.id,
            name: dis.name,
            websiteUrl: dis.websiteUrl,
          })),
        ),
      ],
      2,
      DEFAULT_PAGINATION,
    );

    const result = await useCase.execute(DEFAULT_PAGINATION);

    expect(result).toMatchObject(expectedResult);
    expect(mockOfsRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
