import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from './landbot-customer.interface';

export interface LandbotCustomerRepositoryInterface {
  save(landbotCustomer: LandbotCustomerEntity): Promise<LandbotCustomerEntity>;
  findLast(): Promise<LandbotCustomerEntity | null>;
  groupByEligibility(): Promise<
    { eligibility: LandbotEligibility; count: number }[]
  >;
  groupByBrsKnowledge(): Promise<
    { brsKnowledge: LandbotBrsKnowledge; count: number }[]
  >;
  groupByRealEstateSituation(): Promise<
    { realEstateSituation: LandbotRealEstateSituation; count: number }[]
  >;
}
