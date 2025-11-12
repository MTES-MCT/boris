import { LandbotCustomerEntity } from 'src/infrastructure/landbot-customer/landbot-customer.entity';

export interface LandbotCustomerRepositoryInterface {
  save(landbotCustomer: LandbotCustomerEntity): Promise<LandbotCustomerEntity>;
}
