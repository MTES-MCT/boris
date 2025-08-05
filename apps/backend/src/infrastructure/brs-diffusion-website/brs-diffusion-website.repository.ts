import { Injectable } from '@nestjs/common';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrsDiffusionWebsiteEntity } from './brs-diffusion-website.entity';
import { PaginationProps } from 'src/domain/common/paginationProps';

@Injectable()
export class BrsDiffusionWebsiteRepository
  implements BrsDiffusionWebsiteRepositoryInterface
{
  constructor(
    @InjectRepository(BrsDiffusionWebsiteEntity)
    private readonly repository: Repository<BrsDiffusionWebsiteEntity>,
  ) {}

  public save(
    brsDiffusionWebsite: BrsDiffusionWebsiteEntity,
  ): Promise<BrsDiffusionWebsiteEntity> {
    return this.repository.save(brsDiffusionWebsite);
  }

  public findAll(
    paginationProps: PaginationProps,
  ): Promise<[BrsDiffusionWebsiteEntity[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('brs_diffusion_website')
      .leftJoinAndSelect('brs_diffusion_website.region', 'region')
      .leftJoinAndSelect('brs_diffusion_website.departement', 'departement')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('brs_diffusion_website.createdAt', 'DESC');

    return query.getManyAndCount();
  }
}
