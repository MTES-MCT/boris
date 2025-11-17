import { LandbotApiClientListCustomersInterface } from './landbot-api-client-list-customers.interface';

export interface LandbotApiClientRepositoryInterface {
  listCustomers(
    offset: number,
    limit: number,
  ): Promise<LandbotApiClientListCustomersInterface>;
}
