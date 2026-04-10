import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from './landbot-customer.interface';
import { PaginationProps } from '../common/paginationProps';

export interface LandbotCustomerRepositoryInterface {
  save(landbotCustomer: LandbotCustomerEntity): Promise<LandbotCustomerEntity>;
  findAll(
    paginationProps: PaginationProps,
  ): Promise<[LandbotCustomerEntity[], number]>;
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
}
