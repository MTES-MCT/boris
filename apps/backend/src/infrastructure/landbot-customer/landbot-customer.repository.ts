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

  public async findLast(): Promise<LandbotCustomerEntity | null> {
    return this.repository
      .createQueryBuilder('landbot_customer')
      .orderBy('landbot_customer.date', 'DESC')
      .getOne();
  }
}
