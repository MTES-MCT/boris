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
  DistributorPortalContactFilters,
  PublicEligibilityStatisticsFilters,
  PublicEligibilityStatisticsResult,
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

  public async getPublicStatistics(
    filters: PublicEligibilityStatisticsFilters,
  ): Promise<PublicEligibilityStatisticsResult> {
    const distribution = async (
      expression: string,
      orderExpression: string,
      fieldIsNotNull: string,
    ) => {
      const rows = await this.createPublicStatisticsQuery(filters)
        .select(expression, 'label')
        .addSelect('COUNT(DISTINCT eligibility_simulation.id)', 'count')
        .andWhere(fieldIsNotNull)
        .groupBy(expression)
        .orderBy(orderExpression, 'ASC')
        .getRawMany<{ label: string; count: string }>();

      return rows.map((row) => ({
        label: row.label,
        count: Number(row.count),
      }));
    };

    const summaryPromise = this.createPublicStatisticsQuery(filters)
      .select('COUNT(DISTINCT eligibility_simulation.id)', 'simulations')
      .addSelect(
        `COUNT(DISTINCT eligibility_simulation.id) FILTER (
          WHERE eligibility_simulation."highestEligibilityZone" != 'NONE'
        )`,
        'eligible',
      )
      .addSelect(
        `COUNT(DISTINCT eligibility_simulation.id) FILTER (
          WHERE eligibility_simulation."highestEligibilityZone" != 'NONE'
            AND eligibility_simulation."hasRefusedConnection" = false
            AND eligibility_simulation.email IS NOT NULL
            AND eligibility_simulation.contribution IS NOT NULL
            AND eligibility_simulation.resources IS NOT NULL
        )`,
        'contactable',
      )
      .addSelect(
        'COUNT(DISTINCT eligibility_simulation.id) FILTER (WHERE stats_location.id IS NOT NULL)',
        'geolocated',
      )
      .addSelect(
        'MAX(COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt"))',
        'updatedAt',
      )
      .getRawOne<{
        simulations: string;
        eligible: string;
        contactable: string;
        geolocated: string;
        updatedAt: Date | null;
      }>();

    const regionsPromise = this.createPublicStatisticsQuery(filters)
      .select('stats_region.code', 'code')
      .addSelect('stats_region.name', 'label')
      .addSelect('COUNT(DISTINCT eligibility_simulation.id)', 'count')
      .innerJoin('stats_departement.region', 'stats_region')
      .andWhere('stats_location.id IS NOT NULL')
      .groupBy('stats_region.code')
      .addGroupBy('stats_region.name')
      .orderBy('COUNT(DISTINCT eligibility_simulation.id)', 'DESC')
      .limit(10)
      .getRawMany<{ code: string; label: string; count: string }>();

    const zonesPromise = this.createPublicStatisticsQuery(filters)
      .select('stats_location."postalCode"', 'postalCode')
      .addSelect('stats_departement.code', 'departementCode')
      .addSelect('COUNT(DISTINCT eligibility_simulation.id)', 'count')
      .andWhere('stats_location."postalCode" IS NOT NULL')
      .andWhere(`TRIM(stats_location."postalCode") != ''`)
      .groupBy('stats_location."postalCode"')
      .addGroupBy('stats_departement.code')
      .having('COUNT(DISTINCT eligibility_simulation.id) >= 10')
      .orderBy('COUNT(DISTINCT eligibility_simulation.id)', 'DESC')
      .limit(12)
      .getRawMany<{
        postalCode: string;
        departementCode: string;
        count: string;
      }>();

    const departementsPromise = this.repository.manager
      .createQueryBuilder()
      .select('departement.code', 'code')
      .addSelect('departement.name', 'name')
      .from('departement', 'departement')
      .orderBy('departement.code', 'ASC')
      .getRawMany<{ code: string; name: string }>();

    const postalCodesPromise = filters.departementCode
      ? this.repository.manager
          .createQueryBuilder()
          .select('location."postalCode"', 'postalCode')
          .from('location', 'location')
          .innerJoin(
            'departement',
            'departement',
            'departement.id = location."departementId"',
          )
          .where('departement.code = :departementCode', {
            departementCode: filters.departementCode,
          })
          .andWhere('location."postalCode" IS NOT NULL')
          .andWhere(`TRIM(location."postalCode") != ''`)
          .groupBy('location."postalCode"')
          .having('COUNT(DISTINCT location."eligibilitySimulationId") >= 10')
          .orderBy('location."postalCode"', 'ASC')
          .getRawMany<{ postalCode: string }>()
      : Promise.resolve([]);

    const [
      summary,
      regions,
      zones,
      householdSizes,
      propertySituations,
      incomeRanges,
      employmentStatuses,
      housingTypes,
      brsKnowledge,
      departements,
      postalCodes,
    ] = await Promise.all([
      summaryPromise,
      regionsPromise,
      zonesPromise,
      distribution(
        `CASE
          WHEN eligibility_simulation."householdSize" >= 6 THEN '6 personnes et plus'
          WHEN eligibility_simulation."householdSize" = 1 THEN '1 personne'
          ELSE eligibility_simulation."householdSize"::text || ' personnes'
        END`,
        'MIN(eligibility_simulation."householdSize")',
        'eligibility_simulation."householdSize" IS NOT NULL',
      ),
      distribution(
        `CASE eligibility_simulation."propertySituation"
          WHEN 'LOCATAIRE_PRIVE' THEN 'Locataire privé'
          WHEN 'LOCATAIRE_SOCIAL' THEN 'Locataire social'
          WHEN 'HEBERGE' THEN 'Hébergé'
          WHEN 'PROPRIETAIRE' THEN 'Propriétaire'
          ELSE 'Autre'
        END`,
        'COUNT(DISTINCT eligibility_simulation.id)',
        'eligibility_simulation."propertySituation" IS NOT NULL',
      ),
      distribution(
        `CASE
          WHEN eligibility_simulation.resources < 20000 THEN '< 20k'
          WHEN eligibility_simulation.resources < 30000 THEN '20k-30k'
          WHEN eligibility_simulation.resources < 40000 THEN '30k-40k'
          WHEN eligibility_simulation.resources < 55000 THEN '40k-55k'
          ELSE '55k+'
        END`,
        'MIN(eligibility_simulation.resources)',
        'eligibility_simulation.resources IS NOT NULL',
      ),
      distribution(
        `CASE eligibility_simulation."employmentStatus"
          WHEN 'SALARIE_PRIVE_NON_AGRICOLE' THEN 'Salarié privé non agricole'
          WHEN 'SALARIE_PUBLIC_OU_FONCTIONNAIRE' THEN 'Salarié public / fonctionnaire'
          WHEN 'SANS_ACTIVITE_PROFESSIONNELLE' THEN 'Sans activité professionnelle'
          WHEN 'INDEPENDANT' THEN 'Indépendant'
          WHEN 'RETRAITE' THEN 'Retraité'
          WHEN 'SALARIE_AGRICOLE' THEN 'Salarié agricole'
          WHEN 'SALARIE_GROUPE_LA_POSTE' THEN 'Salarié groupe La Poste'
        END`,
        'COUNT(DISTINCT eligibility_simulation.id)',
        'eligibility_simulation."employmentStatus" IS NOT NULL',
      ),
      distribution(
        'eligibility_simulation."housingType"',
        'eligibility_simulation."housingType"',
        'eligibility_simulation."housingType" IS NOT NULL',
      ),
      distribution(
        `CASE eligibility_simulation."hadBrsKnowledge"
          WHEN false THEN 'Ne connaissait pas le BRS'
          WHEN true THEN 'Connaissait le BRS'
        END`,
        'eligibility_simulation."hadBrsKnowledge"',
        'eligibility_simulation."hadBrsKnowledge" IS NOT NULL',
      ),
      departementsPromise,
      postalCodesPromise,
    ]);

    return {
      updatedAt: summary?.updatedAt ?? null,
      totals: {
        simulations: Number(summary?.simulations ?? 0),
        eligible: Number(summary?.eligible ?? 0),
        contactable: Number(summary?.contactable ?? 0),
        geolocated: Number(summary?.geolocated ?? 0),
      },
      regions: regions.map((row) => ({ ...row, count: Number(row.count) })),
      zones: zones.map((row) => ({ ...row, count: Number(row.count) })),
      householdSizes,
      propertySituations: propertySituations.sort((a, b) => b.count - a.count),
      incomeRanges,
      employmentStatuses: employmentStatuses.sort((a, b) => b.count - a.count),
      housingTypes,
      brsKnowledge: brsKnowledge.sort((a, b) => b.count - a.count),
      filters: {
        departements,
        postalCodes: postalCodes.map((row) => row.postalCode),
      },
    };
  }

  private createPublicStatisticsQuery(
    filters: PublicEligibilityStatisticsFilters,
  ) {
    const query = this.repository
      .createQueryBuilder('eligibility_simulation')
      .leftJoin('eligibility_simulation.locations', 'stats_location')
      .leftJoin('stats_location.departement', 'stats_departement');

    if (filters.departementCode) {
      query.andWhere('stats_departement.code = :departementCode', {
        departementCode: filters.departementCode,
      });
    }

    if (filters.postalCode) {
      query.andWhere('stats_location."postalCode" = :postalCode', {
        postalCode: filters.postalCode,
      });
    }

    return query;
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

  public async countPortalContactsByOfsScope(
    filters: PortalEligibilitySimulationContactFilters,
  ): Promise<number> {
    const query = this.createPortalContactsQuery(filters, false);

    if (!query) {
      return 0;
    }

    return query.getCount();
  }

  public async hasPortalContactInOfsScope(
    simulationId: string,
    filters: PortalEligibilitySimulationContactFilters,
  ): Promise<boolean> {
    const query = this.createPortalContactsQuery(filters, false);

    if (!query) {
      return false;
    }

    const total = await query
      .andWhere('eligibility_simulation.id = :simulationId', { simulationId })
      .getCount();

    return total > 0;
  }

  public async findPortalContactsByDistributorScope(
    pagination: PaginationProps,
    filters: DistributorPortalContactFilters,
  ): Promise<[PortalEligibilitySimulationContactResult[], number]> {
    const query = this.createDistributorPortalContactsQuery(filters);

    query.orderBy(
      'COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt")',
      'DESC',
    );
    query.addOrderBy('location.id', 'DESC');
    query.offset((pagination.page - 1) * pagination.pageSize);
    query.limit(pagination.pageSize);

    const items =
      await query.getRawMany<PortalEligibilitySimulationContactResult>();
    const total = await this.createDistributorPortalContactsQuery(
      filters,
      false,
    ).getCount();

    return [items, total];
  }

  public async findAllPortalContactsByDistributorScope(
    filters: DistributorPortalContactFilters,
  ): Promise<PortalEligibilitySimulationContactResult[]> {
    const query = this.createDistributorPortalContactsQuery(filters);

    query.orderBy(
      'COALESCE(eligibility_simulation."landbotDate", eligibility_simulation."createdAt")',
      'DESC',
    );
    query.addOrderBy('location.id', 'DESC');

    return query.getRawMany<PortalEligibilitySimulationContactResult>();
  }

  public async hasPortalContactInDistributorScope(
    simulationId: string,
    filters: DistributorPortalContactFilters,
  ): Promise<boolean> {
    const total = await this.createDistributorPortalContactsQuery(
      filters,
      false,
    )
      .andWhere('eligibility_simulation.id = :simulationId', { simulationId })
      .getCount();

    return total > 0;
  }

  private createPortalContactsQuery(
    filters: PortalEligibilitySimulationContactFilters,
    withSelects = true,
  ) {
    const query = this.repository
      .createQueryBuilder('eligibility_simulation')
      .innerJoin('eligibility_simulation.locations', 'location')
      .innerJoin('location.departement', 'departement')
      .leftJoin(
        'ofs_eligibility_simulation',
        'ofs_eligibility_simulation',
        'ofs_eligibility_simulation."eligibilitySimulationId" = eligibility_simulation.id AND ofs_eligibility_simulation."ofsId" = :ofsId',
        { ofsId: filters.ofsId },
      )
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
        .addSelect('eligibility_simulation.resources', 'resources')
        .addSelect('ofs_eligibility_simulation.action', 'action')
        .addSelect('ofs_eligibility_simulation.status', 'status')
        .addSelect(
          `(SELECT COALESCE(json_agg(json_build_object('id', distributor.id, 'name', distributor.name) ORDER BY distributor.name), '[]'::json)
            FROM commercial_transmission transmission
            INNER JOIN distributor distributor ON distributor.id = transmission."distributorId"
            WHERE transmission."ofsId" = :ofsId
            AND transmission."isActive" = true
            AND (
              transmission."scopeType" = 'ALL'
              OR location.citycode = ANY(transmission."inseeCodes")
              OR departement.code = ANY(transmission."departementCodes")
            ))`,
          'transmittedDistributors',
        );
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
    if (filters.departementIds.length > 0) {
      query.andWhere('departement.id IN (:...departementIds)', filters);
      return true;
    }

    return false;
  }

  private createDistributorPortalContactsQuery(
    filters: DistributorPortalContactFilters,
    withSelects = true,
  ) {
    const query = this.repository
      .createQueryBuilder('eligibility_simulation')
      .innerJoin('eligibility_simulation.locations', 'location')
      .innerJoin('location.departement', 'departement')
      .innerJoin(
        'commercial_transmission',
        'commercial_transmission',
        `commercial_transmission."distributorId" = :distributorId
        AND commercial_transmission."isActive" = true
        AND (
          commercial_transmission."scopeType" = 'ALL'
          OR location.citycode = ANY(commercial_transmission."inseeCodes")
          OR departement.code = ANY(commercial_transmission."departementCodes")
        )`,
        { distributorId: filters.distributorId },
      )
      .innerJoin('ofs', 'ofs', 'ofs.id = commercial_transmission."ofsId"')
      .leftJoin(
        'distributor_eligibility_simulation',
        'distributor_eligibility_simulation',
        'distributor_eligibility_simulation."eligibilitySimulationId" = eligibility_simulation.id AND distributor_eligibility_simulation."distributorId" = :distributorId',
        { distributorId: filters.distributorId },
      )
      .where('eligibility_simulation."hasRefusedConnection" = false')
      .andWhere('eligibility_simulation.email IS NOT NULL')
      .andWhere('eligibility_simulation.contribution IS NOT NULL')
      .andWhere('eligibility_simulation.resources IS NOT NULL')
      .andWhere(
        `EXISTS (
          SELECT 1 FROM ofs_departement
          WHERE ofs_departement."ofsId" = ofs.id
          AND ofs_departement."departementId" = departement.id
        )`,
      );

    if (filters.ofsId) {
      query.andWhere('ofs.id = :ofsId', { ofsId: filters.ofsId });
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
        .addSelect('eligibility_simulation.resources', 'resources')
        .addSelect('distributor_eligibility_simulation.action', 'action')
        .addSelect('distributor_eligibility_simulation.status', 'status')
        .addSelect('ofs.id', 'ofsId')
        .addSelect('ofs.name', 'ofsName')
        .addSelect('ofs.email', 'ofsEmail')
        .addSelect('ofs.phone', 'ofsPhone')
        .addSelect('ofs."websiteUrl"', 'ofsWebsiteUrl');
    }

    return query;
  }
}
