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
  countSimulations(): Promise<number>;
  groupByRegions(): Promise<[GroupByRegionsResult[], total: number]>;
}
