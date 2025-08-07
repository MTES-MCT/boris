import { Injectable } from '@nestjs/common';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BrsDiffusionWebsiteEntity,
  BrsDiffusionWebsiteEntityWithDistance,
} from './brs-diffusion-website.entity';
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

  public async findById(id: string): Promise<BrsDiffusionWebsiteEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['region', 'departement'],
    });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async findAllByLocation(
    paginationProps: PaginationProps,
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<[BrsDiffusionWebsiteEntityWithDistance[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('brs_diffusion_website')
      .leftJoinAndSelect('brs_diffusion_website.region', 'region')
      .leftJoinAndSelect('brs_diffusion_website.departement', 'departement')
      .addSelect(
        'earth_distance(ll_to_earth(:latitude, :longitude), ll_to_earth(brs_diffusion_website.latitude, brs_diffusion_website.longitude))',
        'distance',
      )
      .where(
        'earth_box(ll_to_earth(:latitude, :longitude), :radius) @> ll_to_earth(brs_diffusion_website.latitude, brs_diffusion_website.longitude)',
      )
      .andWhere(
        'earth_distance(ll_to_earth(:latitude, :longitude), ll_to_earth(brs_diffusion_website.latitude, brs_diffusion_website.longitude)) < :radius',
      )
      .setParameters({
        latitude,
        longitude,
        radius: radius * 1000,
      })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('distance', 'ASC');

    const count = await query.getCount();
    const rawAndEntities = await query.getRawAndEntities();

    const result = rawAndEntities.entities.map((item, index) => {
      return {
        ...item,
        distance: rawAndEntities.raw[index].distance,
      };
    });

    return [result, count];
  }

  public findAllByRegion(
    paginationProps: PaginationProps,
    regionId: string,
  ): Promise<[BrsDiffusionWebsiteEntity[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('brs_diffusion_website')
      .leftJoinAndSelect('brs_diffusion_website.region', 'region')
      .leftJoinAndSelect('brs_diffusion_website.departement', 'departement')
      .where('region.id = :regionId', { regionId })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('brs_diffusion_website.createdAt', 'DESC');

    return query.getManyAndCount();
  }

  public findAllByDepartement(
    paginationProps: PaginationProps,
    departementId: string,
  ): Promise<[BrsDiffusionWebsiteEntity[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('brs_diffusion_website')
      .leftJoinAndSelect('brs_diffusion_website.region', 'region')
      .leftJoinAndSelect('brs_diffusion_website.departement', 'departement')
      .where('departement.id = :departementId', { departementId })
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('brs_diffusion_website.createdAt', 'DESC');

    return query.getManyAndCount();
  }
}
