import { Injectable, NotFoundException } from '@nestjs/common';
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

  public async save(
    brsDiffusionWebsite: BrsDiffusionWebsiteEntity,
  ): Promise<BrsDiffusionWebsiteEntity> {
    if (!brsDiffusionWebsite.id) {
      return this.repository.save(brsDiffusionWebsite);
    }

    // An edit may finish geocoding after another request deleted the programme.
    // Update only active rows and never write the deletion flag from a stale entity.
    const result = await this.repository.update(
      { id: brsDiffusionWebsite.id, isDeleted: false },
      {
        source: brsDiffusionWebsite.source,
        programName: brsDiffusionWebsite.programName,
        ofsName: brsDiffusionWebsite.ofsName,
        distributorName: brsDiffusionWebsite.distributorName,
        ofs: brsDiffusionWebsite.ofs,
        distributor: brsDiffusionWebsite.distributor,
        address: brsDiffusionWebsite.address,
        city: brsDiffusionWebsite.city,
        zipcode: brsDiffusionWebsite.zipcode,
        inseeCode: brsDiffusionWebsite.inseeCode,
        latitude: brsDiffusionWebsite.latitude,
        longitude: brsDiffusionWebsite.longitude,
        region: brsDiffusionWebsite.region,
        departement: brsDiffusionWebsite.departement,
        deliveryMonth: brsDiffusionWebsite.deliveryMonth,
        housingType: brsDiffusionWebsite.housingType,
      },
    );
    if (!result.affected) throw new NotFoundException();
    const program = await this.findById(brsDiffusionWebsite.id);
    if (!program) throw new NotFoundException();
    return program;
  }

  public findAll(
    paginationProps: PaginationProps,
  ): Promise<[BrsDiffusionWebsiteEntity[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('brs_diffusion_website')
      .leftJoinAndSelect('brs_diffusion_website.region', 'region')
      .leftJoinAndSelect('brs_diffusion_website.departement', 'departement')
      .leftJoinAndSelect('brs_diffusion_website.ofs', 'ofs')
      .leftJoinAndSelect('brs_diffusion_website.distributor', 'distributor')
      .andWhere('brs_diffusion_website.isDeleted = false')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('brs_diffusion_website.createdAt', 'DESC');

    return query.getManyAndCount();
  }

  public async findById(id: string): Promise<BrsDiffusionWebsiteEntity | null> {
    return this.repository.findOne({
      where: { id, isDeleted: false },
      relations: ['region', 'departement', 'ofs', 'distributor'],
    });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.update(id, { isDeleted: true });
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
      .leftJoinAndSelect('brs_diffusion_website.ofs', 'ofs')
      .leftJoinAndSelect('brs_diffusion_website.distributor', 'distributor')
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
      .andWhere('brs_diffusion_website.isDeleted = false')
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

  public async findNearestOfssByLocation(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<BrsDiffusionWebsiteEntityWithDistance[]> {
    const distanceExpression =
      'earth_distance(ll_to_earth(:latitude, :longitude), ll_to_earth(brs_diffusion_website.latitude, brs_diffusion_website.longitude))';

    const query = this.repository
      .createQueryBuilder('brs_diffusion_website')
      .innerJoinAndSelect('brs_diffusion_website.ofs', 'ofs')
      .leftJoinAndSelect('ofs.departements', 'ofsDepartements')
      .leftJoinAndSelect('ofs.regions', 'ofsRegions')
      .leftJoinAndSelect('ofs.distributors', 'ofsDistributors')
      .leftJoinAndSelect('brs_diffusion_website.region', 'region')
      .leftJoinAndSelect('brs_diffusion_website.departement', 'departement')
      .leftJoinAndSelect('brs_diffusion_website.distributor', 'distributor')
      .addSelect(distanceExpression, 'distance')
      .where(
        'earth_box(ll_to_earth(:latitude, :longitude), :radius) @> ll_to_earth(brs_diffusion_website.latitude, brs_diffusion_website.longitude)',
      )
      .andWhere(`${distanceExpression} < :radius`)
      .andWhere('brs_diffusion_website.isDeleted = false')
      .setParameters({
        latitude,
        longitude,
        radius: radius * 1000,
      })
      .orderBy('distance', 'ASC');

    const rawAndEntities = await query.getRawAndEntities();
    return rawAndEntities.entities
      .filter((item) => item.ofs)
      .map((item, index) => {
        return {
          ...item,
          distance: rawAndEntities.raw[index].distance,
        };
      });
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
      .leftJoinAndSelect('brs_diffusion_website.ofs', 'ofs')
      .leftJoinAndSelect('brs_diffusion_website.distributor', 'distributor')
      .where('region.id = :regionId', { regionId })
      .andWhere('brs_diffusion_website.isDeleted = false')
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
      .leftJoinAndSelect('brs_diffusion_website.ofs', 'ofs')
      .leftJoinAndSelect('brs_diffusion_website.distributor', 'distributor')
      .where('departement.id = :departementId', { departementId })
      .andWhere('brs_diffusion_website.isDeleted = false')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('brs_diffusion_website.createdAt', 'DESC');

    return query.getManyAndCount();
  }
}
