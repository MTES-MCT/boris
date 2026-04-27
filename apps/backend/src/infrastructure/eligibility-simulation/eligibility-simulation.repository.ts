import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  EligibilitySimulationConversionFunnelResult,
  EligibilitySimulationRepositoryInterface,
  GroupByBrsKnowledgeResult,
  GroupByDepartementsResult,
  GroupByEligibilityStatsResult,
  GroupByRealEstateSituationResult,
  GroupByRegionsResult,
  GroupSimulationsByYearAndMonthResult,
  PortalEligibilitySimulationContactFilters,
  PortalEligibilitySimulationContactResult,
} from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationEntity } from './eligibility-simulation.entity';
import { PaginationProps } from 'src/domain/common/paginationProps';

@Injectable()
export class EligibilitySimulationRepository
  implements EligibilitySimulationRepositoryInterface
{
  constructor(
    @InjectRepository(EligibilitySimulationEntity)
    private readonly repository: Repository<EligibilitySimulationEntity>,
  ) {}

  public save(
    eligibilitySimulation: EligibilitySimulationEntity,
  ): Promise<EligibilitySimulationEntity> {
    return this.repository.save(eligibilitySimulation);
  }

  public async findById(
    id: string,
  ): Promise<EligibilitySimulationEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['locations', 'locations.departement'],
    });
  }

  public async groupByEligibilityStats(): Promise<
    GroupByEligibilityStatsResult[]
  > {
    const result = await this.repository
      .createQueryBuilder('eligibility_simulation')
      .select('eligibility_simulation.highestEligibilityZone', 'eligibility')
      .addSelect('COUNT(*)', 'count')
      .groupBy('eligibility_simulation.highestEligibilityZone')
      .getRawMany<{
        eligibility: GroupByEligibilityStatsResult['eligibility'];
        count: string;
      }>();

    const countByZone = result.reduce<
      Record<GroupByEligibilityStatsResult['eligibility'], string>
    >(
      (accumulator, item) => {
        accumulator[item.eligibility] = item.count;

        return accumulator;
      },
      {
        B2_AND_C: '0',
        B1: '0',
        A_AND_ABIS: '0',
        NONE: '0',
      },
    );

    return [
      { eligibility: 'B2_AND_C', count: countByZone.B2_AND_C },
      { eligibility: 'B1', count: countByZone.B1 },
      { eligibility: 'A_AND_ABIS', count: countByZone.A_AND_ABIS },
      { eligibility: 'NONE', count: countByZone.NONE },
    ];
  }

  public async groupByBrsKnowledge(): Promise<GroupByBrsKnowledgeResult[]> {
    const result = await this.repository
      .createQueryBuilder('eligibility_simulation')
      .select(
        `CASE
          WHEN eligibility_simulation."hadBrsKnowledge" = true THEN 'Oui'
          WHEN eligibility_simulation."hadBrsKnowledge" = false THEN 'Non'
          ELSE NULL
        END`,
        'brsKnowledge',
      )
      .addSelect('COUNT(DISTINCT eligibility_simulation.id)', 'count')
      .innerJoin('eligibility_simulation.locations', 'location')
      .groupBy('eligibility_simulation."hadBrsKnowledge"')
      .getRawMany<GroupByBrsKnowledgeResult>();

    return result;
  }

  public async groupByRealEstateSituation(): Promise<
    GroupByRealEstateSituationResult[]
  > {
    const result = await this.repository
      .createQueryBuilder('eligibility_simulation')
      .select(
        `CASE
          WHEN eligibility_simulation."propertySituation" = 'PROPRIETAIRE' THEN 'propriétaire d''un logement'
          WHEN eligibility_simulation."propertySituation" = 'LOCATAIRE_SOCIAL' THEN 'locataire d''un logement social'
          WHEN eligibility_simulation."propertySituation" = 'LOCATAIRE_PRIVE' THEN 'locataire d''un logement privé'
          WHEN eligibility_simulation."propertySituation" = 'HEBERGE' THEN 'hebergé·e'
          WHEN eligibility_simulation."propertySituation" = 'AUTRE' THEN 'dans une autre situation immobilière'
          ELSE NULL
        END`,
        'realEstateSituation',
      )
      .addSelect('COUNT(DISTINCT eligibility_simulation.id)', 'count')
      .innerJoin('eligibility_simulation.locations', 'location')
      .groupBy('eligibility_simulation."propertySituation"')
      .getRawMany<GroupByRealEstateSituationResult>();

    return result;
  }

  public async groupSimulationsByYearAndMonth(): Promise<
    GroupSimulationsByYearAndMonthResult[]
  > {
    return this.repository
      .createQueryBuilder('eligibility_simulation')
      .select(
        `EXTRACT(YEAR FROM COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt"))`,
        'year',
      )
      .addSelect(
        `EXTRACT(MONTH FROM COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt"))`,
        'month',
      )
      .addSelect('COUNT(*)', 'count')
      .where(`eligibility_simulation."highestEligibilityZone" != 'NONE'`)
      .groupBy(
        `EXTRACT(YEAR FROM COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt"))`,
      )
      .addGroupBy(
        `EXTRACT(MONTH FROM COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt"))`,
      )
      .orderBy('year')
      .addOrderBy('month')
      .getRawMany<GroupSimulationsByYearAndMonthResult>();
  }

  public async groupByRegions(): Promise<
    [GroupByRegionsResult[], total: number]
  > {
    const query = this.repository
      .createQueryBuilder('eligibility_simulation')
      .select('region.name', 'regionName')
      .addSelect('region.code', 'regionCode')
      .addSelect('COUNT(DISTINCT eligibility_simulation.id)', 'count')
      .innerJoin('eligibility_simulation.locations', 'location')
      .innerJoin('location.departement', 'departement')
      .innerJoin('departement.region', 'region')
      .groupBy('region.name')
      .addGroupBy('region.code');

    const result = await query.getRawMany<GroupByRegionsResult>();

    const total = await this.repository
      .createQueryBuilder('eligibility_simulation')
      .select('COUNT(DISTINCT eligibility_simulation.id)', 'count')
      .innerJoin('eligibility_simulation.locations', 'location')
      .getRawOne<{ count: string }>();

    return [result, Number(total?.count ?? 0)];
  }

  public async groupByDepartements(): Promise<GroupByDepartementsResult[]> {
    return this.repository
      .createQueryBuilder('eligibility_simulation')
      .select('departement.code', 'departementCode')
      .addSelect('COUNT(DISTINCT eligibility_simulation.id)', 'count')
      .innerJoin('eligibility_simulation.locations', 'location')
      .innerJoin('location.departement', 'departement')
      .groupBy('departement.code')
      .getRawMany<GroupByDepartementsResult>();
  }

  public async calculateConversionFunnel(): Promise<EligibilitySimulationConversionFunnelResult> {
    const result = await this.repository
      .createQueryBuilder('eligibility_simulation')
      .select('COUNT(*)', 'totalSimulations')
      .addSelect(
        `COUNT(*) FILTER (
          WHERE eligibility_simulation."householdSize" IS NOT NULL
          OR eligibility_simulation."hasDisability" IS NOT NULL
        )`,
        'totalHouseholdProvided',
      )
      .addSelect(
        `COUNT(*) FILTER (
          WHERE (
            eligibility_simulation."householdSize" IS NOT NULL
            OR eligibility_simulation."hasDisability" IS NOT NULL
          )
          AND eligibility_simulation."highestEligibilityZone" != 'NONE'
        )`,
        'totalEligible',
      )
      .addSelect(
        `COUNT(*) FILTER (
          WHERE (
            eligibility_simulation."householdSize" IS NOT NULL
            OR eligibility_simulation."hasDisability" IS NOT NULL
          )
          AND eligibility_simulation."highestEligibilityZone" != 'NONE'
          AND eligibility_simulation."hasRefusedConnection" = false
        )`,
        'totalConnectionWish',
      )
      .addSelect(
        `COUNT(*) FILTER (
          WHERE (
            eligibility_simulation."householdSize" IS NOT NULL
            OR eligibility_simulation."hasDisability" IS NOT NULL
          )
          AND eligibility_simulation."highestEligibilityZone" != 'NONE'
          AND eligibility_simulation."hasRefusedConnection" = false
          AND eligibility_simulation.email IS NOT NULL
        )`,
        'totalEmailProvided',
      )
      .addSelect(
        `COUNT(DISTINCT eligibility_simulation.id) FILTER (
          WHERE (
            eligibility_simulation."householdSize" IS NOT NULL
            OR eligibility_simulation."hasDisability" IS NOT NULL
          )
          AND eligibility_simulation."highestEligibilityZone" != 'NONE'
          AND eligibility_simulation."hasRefusedConnection" = false
          AND eligibility_simulation.email IS NOT NULL
          AND location.id IS NOT NULL
        )`,
        'totalDesiredCityProvided',
      )
      .leftJoin('eligibility_simulation.locations', 'location')
      .where(
        `eligibility_simulation."createdAt" >= CURRENT_DATE - INTERVAL '30 days'`,
      )
      .getRawOne<{
        totalSimulations: string;
        totalHouseholdProvided: string;
        totalEligible: string;
        totalConnectionWish: string;
        totalEmailProvided: string;
        totalDesiredCityProvided: string;
      }>();

    return {
      totalSimulations: Number(result?.totalSimulations ?? 0),
      totalHouseholdProvided: Number(result?.totalHouseholdProvided ?? 0),
      totalEligible: Number(result?.totalEligible ?? 0),
      totalConnectionWish: Number(result?.totalConnectionWish ?? 0),
      totalEmailProvided: Number(result?.totalEmailProvided ?? 0),
      totalDesiredCityProvided: Number(result?.totalDesiredCityProvided ?? 0),
    };
  }

  public async findPortalContactsByOfsScope(
    pagination: PaginationProps,
    filters: PortalEligibilitySimulationContactFilters,
  ): Promise<[PortalEligibilitySimulationContactResult[], number]> {
    const query = this.createPortalContactsQuery(filters);

    if (!query) {
      return [[], 0];
    }

    query.orderBy(
      'COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt")',
      'DESC',
    );
    query.addOrderBy('location.id', 'DESC');
    query.offset((pagination.page - 1) * pagination.pageSize);
    query.limit(pagination.pageSize);

    const items =
      await query.getRawMany<PortalEligibilitySimulationContactResult>();

    const countQuery = this.createPortalContactsQuery(filters, false);

    const total = countQuery ? await countQuery.getCount() : 0;

    return [items, total];
  }

  public async findAllPortalContactsByOfsScope(
    filters: PortalEligibilitySimulationContactFilters,
  ): Promise<PortalEligibilitySimulationContactResult[]> {
    const query = this.createPortalContactsQuery(filters);

    if (!query) {
      return [];
    }

    query.orderBy(
      'COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt")',
      'DESC',
    );
    query.addOrderBy('location.id', 'DESC');

    return query.getRawMany<PortalEligibilitySimulationContactResult>();
  }

  private createPortalContactsQuery(
    filters: PortalEligibilitySimulationContactFilters,
    withSelects = true,
  ) {
    const query = this.repository
      .createQueryBuilder('eligibility_simulation')
      .innerJoin('eligibility_simulation.locations', 'location')
      .innerJoin('location.departement', 'departement')
      .innerJoin('departement.region', 'region')
      .where('eligibility_simulation."hasRefusedConnection" = false')
      .andWhere('eligibility_simulation.email IS NOT NULL')
      .andWhere('eligibility_simulation.contribution IS NOT NULL')
      .andWhere('eligibility_simulation.resources IS NOT NULL');

    if (withSelects) {
      query
        .select('eligibility_simulation.id', 'simulationId')
        .addSelect('location.id', 'locationId')
        .addSelect(
          'COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt")',
          'submittedAt',
        )
        .addSelect(
          `NULLIF(TRIM(CONCAT(COALESCE(eligibility_simulation."firstName", ''), ' ', COALESCE(eligibility_simulation."lastName", ''))), '')`,
          'fullName',
        )
        .addSelect('eligibility_simulation.email', 'email')
        .addSelect('eligibility_simulation.phone', 'phone')
        .addSelect('departement.code', 'departementCode')
        .addSelect('location.city', 'city')
        .addSelect('eligibility_simulation.contribution', 'contribution')
        .addSelect('eligibility_simulation."householdSize"', 'householdSize')
        .addSelect('eligibility_simulation."hasDisability"', 'hasDisability')
        .addSelect('eligibility_simulation."taxableIncome"', 'taxableIncome')
        .addSelect(
          'eligibility_simulation."propertySituation"',
          'propertySituation',
        )
        .addSelect('eligibility_simulation."housingType"', 'housingType')
        .addSelect('eligibility_simulation.resources', 'resources');
    }

    if (!this.applyPortalScopeFilters(query, filters)) {
      return null;
    }

    if (filters.startDate) {
      query.andWhere(
        'DATE(COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt")) >= :startDate',
        { startDate: filters.startDate },
      );
    }

    if (filters.endDate) {
      query.andWhere(
        'DATE(COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt")) <= :endDate',
        { endDate: filters.endDate },
      );
    }

    return query;
  }

  private applyPortalScopeFilters(
    query: SelectQueryBuilder<EligibilitySimulationEntity>,
    filters: PortalEligibilitySimulationContactFilters,
  ) {
    if (filters.departementIds.length > 0 && filters.regionIds.length > 0) {
      query.andWhere(
        '(departement.id IN (:...departementIds) OR region.id IN (:...regionIds))',
        filters,
      );
      return true;
    }

    if (filters.departementIds.length > 0) {
      query.andWhere('departement.id IN (:...departementIds)', filters);
      return true;
    }

    if (filters.regionIds.length > 0) {
      query.andWhere('region.id IN (:...regionIds)', filters);
      return true;
    }

    return false;
  }
}
