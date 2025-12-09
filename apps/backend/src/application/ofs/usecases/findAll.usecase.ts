import { Pagination } from 'src/application/common/pagination';
import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { OfsView } from '../views/ofs.view';
import { Inject } from '@nestjs/common';
import { FindAllOfssParams } from './findAll.params';

export class FindAllOfssUsecase {
  constructor(
    @Inject('OfsRepositoryInterface')
    private readonly ofsRepository: OfsRepositoryInterface,
  ) {}

  public async execute(
    params: FindAllOfssParams,
  ): Promise<Pagination<OfsView>> {
    const { page, pageSize } = params;

    const [ofss, totalCount] = await this.ofsRepository.findAll({
      page,
      pageSize,
    });

    const items = ofss.map((ofs) => {
      return new OfsView(
        ofs.id,
        ofs.name,
        ofs.websiteUrl,
        ofs.phone,
        ofs.email,
        ofs.producesBrs,
        ofs.isPartner,
        ofs.departements.map((departement) => ({
          id: departement.id,
          name: departement.name,
          code: departement.code,
        })),
        ofs.regions.map((region) => ({
          id: region.id,
          name: region.name,
        })),
        ofs.distributors.map((distributor) => ({
          id: distributor.id,
          name: distributor.name,
          websiteUrl: distributor.websiteUrl,
        })),
      );
    });

    return new Pagination(items, totalCount, { page, pageSize });
  }
}
