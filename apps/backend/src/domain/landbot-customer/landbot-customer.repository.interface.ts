import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from './landbot-customer.interface';
import { RegionCode } from '../region/region.interface';

export type GroupByRegionsResult = {
  regionName: string;
  regionCode: RegionCode;
  count: string;
};

export type GroupSimulationsByYearAndMonthResult = {
  year: number;
  month: number;
  count: number;
};

export type GroupByDepartementsResult = {
  departementCode: string;
  count: string;
};

export interface LandbotCustomerRepositoryInterface {
  save(landbotCustomer: LandbotCustomerEntity): Promise<LandbotCustomerEntity>;
  findLast(): Promise<LandbotCustomerEntity | null>;
  groupByEligibility(): Promise<
    { eligibility: LandbotEligibility; count: string }[]
  >;
  groupByBrsKnowledge(): Promise<
    { brsKnowledge: LandbotBrsKnowledge; count: string }[]
  >;
  groupByRealEstateSituation(): Promise<
    { realEstateSituation: LandbotRealEstateSituation; count: string }[]
  >;
  countSimulations(year: number, month: number): Promise<number>;
  groupByRegions(
    year?: number,
    month?: number,
  ): Promise<[GroupByRegionsResult[], total: number]>;
  groupByDepartements(): Promise<GroupByDepartementsResult[]>;
  groupSimulationsByYearAndMonth(): Promise<
    GroupSimulationsByYearAndMonthResult[]
  >;
}
