import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConversionFunnelResult,
  GroupByDepartementsResult,
  GroupByRegionsResult,
  GroupSimulationsByYearAndMonthResult,
  LandbotCustomerRepositoryInterface,
} from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerEntity } from './landbot-customer.entity';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';

@Injectable()
export class LandbotCustomerRepository
  implements LandbotCustomerRepositoryInterface
{
  constructor(
    @InjectRepository(LandbotCustomerEntity)
    private readonly repository: Repository<LandbotCustomerEntity>,
  ) {}

  public save(
    landbotCustomer: LandbotCustomerEntity,
  ): Promise<LandbotCustomerEntity> {
    return this.repository.save(landbotCustomer);
  }

  public findLast(): Promise<LandbotCustomerEntity | null> {
    return this.repository
      .createQueryBuilder('landbot_customer')
      .orderBy('landbot_customer.date', 'DESC')
      .getOne();
  }

  public async groupByEligibility(): Promise<
    { eligibility: LandbotEligibility; count: string }[]
  > {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`landbot_customer.eligibility`, 'eligibility')
      .addSelect(`COUNT(*)`, 'count')
      .groupBy(`landbot_customer.eligibility`);

    return query.getRawMany();
  }

  public async groupByBrsKnowledge(): Promise<
    { brsKnowledge: LandbotBrsKnowledge; count: string }[]
  > {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`landbot_customer.brsKnowledge`, 'brsKnowledge')
      .addSelect(`COUNT(*)`, 'count')
      .where(`landbot_customer.desiredCity IS NOT NULL`)
      .groupBy(`landbot_customer.brsKnowledge`);

    return query.getRawMany();
  }

  public async groupByRealEstateSituation(): Promise<
    { realEstateSituation: LandbotRealEstateSituation; count: string }[]
  > {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`landbot_customer.realEstateSituation`, 'realEstateSituation')
      .addSelect(`COUNT(*)`, 'count')
      .where(`landbot_customer.desiredCity IS NOT NULL`)
      .groupBy(`landbot_customer.realEstateSituation`);

    return query.getRawMany();
  }

  public async countSimulations(year: number, month: number): Promise<number> {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`COUNT(*)`, 'count')
      .where(`EXTRACT(YEAR FROM landbot_customer.date) = :year`, { year })
      .andWhere(`EXTRACT(MONTH FROM landbot_customer.date) = :month`, { month })
      .andWhere(`landbot_customer.eligibility in ('1', '2', '4')`);

    return query.getCount();
  }

  public async groupByRegions(
    year?: number,
    month?: number,
  ): Promise<[GroupByRegionsResult[], total: number]> {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`r.name`, 'regionName')
      .addSelect(`r.code`, 'regionCode')
      .addSelect(`COUNT(*)`, 'count')
      .innerJoin('departement', 'd', 'd.id = landbot_customer.departementId')
      .innerJoin('region', 'r', 'r.id = d.regionId')
      .where(`landbot_customer.desiredCity IS NOT NULL`);

    if (year) {
      query.andWhere(`EXTRACT(YEAR FROM landbot_customer.date) = :year`, {
        year,
      });
    }

    if (month) {
      query.andWhere(`EXTRACT(MONTH FROM landbot_customer.date) = :month`, {
        month,
      });
    }

    query.groupBy('r.name').addGroupBy('r.code');

    const result = await query.getRawMany();

    const totalQuery = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`COUNT(*)`, 'count')
      .innerJoin('departement', 'd', 'd.id = landbot_customer.departementId')
      .innerJoin('region', 'r', 'r.id = d.regionId')
      .where(`landbot_customer.desiredCity IS NOT NULL`);

    if (year) {
      totalQuery.andWhere(`EXTRACT(YEAR FROM landbot_customer.date) = :year`, {
        year,
      });
    }

    if (month) {
      totalQuery.andWhere(
        `EXTRACT(MONTH FROM landbot_customer.date) = :month`,
        {
          month,
        },
      );
    }

    const total = await totalQuery.getRawOne();

    return [result, Number(total.count)];
  }

  public async groupSimulationsByYearAndMonth(): Promise<
    GroupSimulationsByYearAndMonthResult[]
  > {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`EXTRACT(YEAR FROM landbot_customer.date)`, 'year')
      .addSelect(`EXTRACT(MONTH FROM landbot_customer.date)`, 'month')
      .addSelect(`COUNT(*)`, 'count')
      .andWhere(`landbot_customer.eligibility in ('1', '2', '4')`)
      .groupBy('EXTRACT(YEAR FROM landbot_customer.date)')
      .addGroupBy('EXTRACT(MONTH FROM landbot_customer.date)')
      .orderBy('year')
      .addOrderBy('month');

    return query.getRawMany();
  }

  public async groupByDepartements(): Promise<GroupByDepartementsResult[]> {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`d.code`, 'departementCode')
      .addSelect(`COUNT(*)`, 'count')
      .innerJoin('departement', 'd', 'd.id = landbot_customer.departementId')
      .where(`landbot_customer.desiredCity IS NOT NULL`)
      .groupBy('d.code');

    return query.getRawMany();
  }

  public async calculateConversionFunnel(): Promise<ConversionFunnelResult> {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select('COUNT(*)', 'totalSimulations')
      .addSelect(
        `COUNT(*) FILTER (WHERE landbot_customer.disability IS NOT NULL OR landbot_customer.declarationType IS NOT NULL)`,
        'totalHouseholdProvided',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE
        (landbot_customer.disability IS NOT NULL OR landbot_customer.declarationType IS NOT NULL)
        AND landbot_customer.eligibility IN ('1', '2', '4')
      )`,
        'totalEligble',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE
        (landbot_customer.disability IS NOT NULL OR landbot_customer.declarationType IS NOT NULL)
        AND landbot_customer.eligibility IN ('1', '2', '4')
        AND landbot_customer.connectionWish = 'Oui'
      )`,
        'totalConnectionWish',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE
        (landbot_customer.disability IS NOT NULL OR landbot_customer.declarationType IS NOT NULL)
        AND landbot_customer.eligibility IN ('1', '2', '4')
        AND landbot_customer.connectionWish = 'Oui'
        AND landbot_customer.hasProvidedEmail = true
      )`,
        'totalEmailProvided',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE
        (landbot_customer.disability IS NOT NULL OR landbot_customer.declarationType IS NOT NULL)
        AND landbot_customer.eligibility IN ('1', '2', '4')
        AND landbot_customer.connectionWish = 'Oui'
        AND landbot_customer.hasProvidedEmail = true
        AND landbot_customer.desiredCity IS NOT NULL
      )`,
        'totalDesiredCityProvided',
      );

    const result = await query.getRawOne();

    return {
      totalSimulations: Number(result.totalSimulations),
      totalHouseholdProvided: Number(result.totalHouseholdProvided),
      totalEligble: Number(result.totalEligble),
      totalConnectionWish: Number(result.totalConnectionWish),
      totalEmailProvided: Number(result.totalEmailProvided),
      totalDesiredCityProvided: Number(result.totalDesiredCityProvided),
    };
  }
}
