import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';
import { LandbotCustomerInterface } from './landbot-customer.interface';

export interface LandbotCustomerRepositoryInterface {
  save(landbotCustomer: LandbotCustomerEntity): Promise<LandbotCustomerEntity>;
  findLast(): Promise<LandbotCustomerEntity | null>;
  groupBy(
    field: keyof LandbotCustomerInterface,
  ): Promise<{ [key in keyof LandbotCustomerInterface]: number }[]>;
}
