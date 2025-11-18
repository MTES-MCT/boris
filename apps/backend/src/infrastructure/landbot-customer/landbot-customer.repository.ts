import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerEntity } from './landbot-customer.entity';
import { LandbotCustomerInterface } from 'src/domain/landbot-customer/landbot-customer.interface';

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
    return this.repository
      .createQueryBuilder('landbot_customer')
      .orderBy('landbot_customer.date', 'DESC')
      .getOne();
  }

  public async groupBy(
    field: keyof LandbotCustomerInterface,
    where?: [key: keyof LandbotCustomerInterface, value: string][],
  ): Promise<{ [key in keyof LandbotCustomerInterface]: number }[]> {
    let query = this.repository
      .createQueryBuilder('landbot_customer')
      .groupBy(field);

    if (where) {
      for (const [column, clause] of where) {
        query = query.andWhere(`landbot_customer.${column} :${clause}`, {
          column,
          clause,
        });
      }
    }

    return query.getRawMany();
  }
}
