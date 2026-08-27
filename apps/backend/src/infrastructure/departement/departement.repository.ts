import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { DepartementEntity } from './departement.entity';
import { DepartementInterface } from 'src/domain/departement/departement.interface';
import { PaginationProps } from 'src/domain/common/paginationProps';

// Current commune and arrondissement codes from Grand Lyon's official commune
// dataset. 69152 is kept for locations recorded before the Oullins-Pierre-Benite
// merger, when Pierre-Benite still had its own INSEE code.
const METROPOLE_DE_LYON_INSEE_CODES = new Set([
  '69003',
  '69029',
  '69033',
  '69034',
  '69040',
  '69044',
  '69046',
  '69063',
  '69068',
  '69069',
  '69071',
  '69072',
  '69081',
  '69085',
  '69087',
  '69088',
  '69089',
  '69091',
  '69096',
  '69100',
  '69116',
  '69117',
  '69123',
  '69127',
  '69142',
  '69143',
  '69149',
  '69152',
  '69153',
  '69163',
  '69168',
  '69191',
  '69194',
  '69199',
  '69202',
  '69204',
  '69205',
  '69207',
  '69233',
  '69244',
  '69250',
  '69256',
  '69259',
  '69260',
  '69266',
  '69271',
  '69273',
  '69275',
  '69276',
  '69278',
  '69279',
  '69282',
  '69283',
  '69284',
  '69286',
  '69290',
  '69292',
  '69293',
  '69296',
  '69381',
  '69382',
  '69383',
  '69384',
  '69385',
  '69386',
  '69387',
  '69388',
  '69389',
]);

@Injectable()
export class DepartementRepository implements DepartementRepositoryInterface {
  constructor(
    @InjectRepository(DepartementEntity)
    private readonly repository: Repository<DepartementEntity>,
  ) {}

  public save(departement: DepartementInterface): Promise<DepartementEntity> {
    return this.repository.save(departement);
  }

  public findOneByName(name: string): Promise<DepartementEntity | null> {
    return this.repository.findOneBy({ name });
  }

  public findOneByCode(code: string): Promise<DepartementEntity | null> {
    return this.repository.findOne({ where: { code }, relations: ['region'] });
  }

  public findOneByInseeCode(
    inseeCode: string,
  ): Promise<DepartementEntity | null> {
    if (METROPOLE_DE_LYON_INSEE_CODES.has(inseeCode)) {
      return this.findOneByCode('69M');
    }

    return this.repository
      .createQueryBuilder('departement')
      .leftJoinAndSelect('departement.region', 'region')
      .where(":inseeCode LIKE departement.code || '%'", { inseeCode })
      .getOne();
  }

  public findManyByNames(names: string[]): Promise<DepartementEntity[]> {
    return this.repository.findBy({
      name: In(names),
    });
  }

  public findAll(
    paginationProps: PaginationProps,
  ): Promise<[DepartementEntity[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('departement')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('departement.code', 'ASC');

    return query.getManyAndCount();
  }
}
