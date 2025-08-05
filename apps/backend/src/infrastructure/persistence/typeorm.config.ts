import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { RegionEntity } from '../region/region.entity';
import { DepartementEntity } from '../departement/departement.entity';
import { OfsEntity } from '../ofs/ofs.entity';
import { DistributorEntity } from '../distributor/distributor.entity';
import { SessionEntity } from '../session/session.entity';
import { UserEntity } from '../user/user.entity';
import { BrsDiffusionWebsiteEntity } from '../brs-diffusion-website/brs-diffusion-website.entity';
dotenv.config();

const test = process.env.NODE_ENV === 'test';

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  url: process.env.POSTGRES_URL,
  host: process.env.POSTGRES_HOST,
  port: !test ? +(process.env.POSTGRES_PORT || '5432') : 5433,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: !test ? process.env.POSTGRES_DB : `${process.env.POSTGRES_DB}-test`,
  entities: [
    SessionEntity,
    UserEntity,
    OfsEntity,
    RegionEntity,
    DepartementEntity,
    DistributorEntity,
    BrsDiffusionWebsiteEntity,
  ],
  migrations: ['dist/infrastructure/persistence/migrations/**/*{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migrations',
  poolSize: 5,
};

export default new DataSource(typeormConfig);
