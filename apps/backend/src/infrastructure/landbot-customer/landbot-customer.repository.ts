import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerEntity } from './landbot-customer.entity';

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
    return this.repository.findOne({ order: { date: 'DESC' } });
  }
}
