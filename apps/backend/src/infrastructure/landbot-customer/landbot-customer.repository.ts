import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerEntity } from './landbot-customer.entity';
import {
  LandbotBrsKnowledge,
  LandbotEligibility,
  LandbotRealEstateSituation,
} from 'src/domain/landbot-customer/landbot-customer.interface';
import { PaginationProps } from 'src/domain/common/paginationProps';

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

  public findAll(
    paginationProps: PaginationProps,
  ): Promise<[LandbotCustomerEntity[], number]> {
    const { page, pageSize } = paginationProps;

    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .leftJoinAndSelect('landbot_customer.departement', 'departement')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('landbot_customer.date', 'DESC');

    return query.getManyAndCount();
  }

  public findLast(): Promise<LandbotCustomerEntity | null> {
    return this.repository
      .createQueryBuilder('landbot_customer')
      .orderBy('landbot_customer.date', 'DESC')
      .getOne();
  }

  public async groupByEligibility(): Promise<
    { eligibility: LandbotEligibility; count: string }[]
  > {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`landbot_customer.eligibility`, 'eligibility')
      .addSelect(`COUNT(*)`, 'count')
      .groupBy(`landbot_customer.eligibility`);

    return query.getRawMany();
  }

  public async groupByBrsKnowledge(): Promise<
    { brsKnowledge: LandbotBrsKnowledge; count: string }[]
  > {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`landbot_customer.brsKnowledge`, 'brsKnowledge')
      .addSelect(`COUNT(*)`, 'count')
      .where(`landbot_customer.desiredCity IS NOT NULL`)
      .groupBy(`landbot_customer.brsKnowledge`);

    return query.getRawMany();
  }

  public async groupByRealEstateSituation(): Promise<
    { realEstateSituation: LandbotRealEstateSituation; count: string }[]
  > {
    const query = this.repository
      .createQueryBuilder('landbot_customer')
      .select(`landbot_customer.realEstateSituation`, 'realEstateSituation')
      .addSelect(`COUNT(*)`, 'count')
      .where(`landbot_customer.desiredCity IS NOT NULL`)
      .groupBy(`landbot_customer.realEstateSituation`);

    return query.getRawMany();
  }
}
