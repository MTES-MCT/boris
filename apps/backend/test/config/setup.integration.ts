/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { Test, TestingModule } from '@nestjs/testing';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from 'src/app.module';
// import { bretagne } from 'test/mocks/region';
// import { DataSource, QueryRunner } from 'typeorm';

// const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } =
//   process.env;

// const dbInfo = {
//   type: 'postgres',
//   host: POSTGRES_HOST,
//   port: 5433,
//   username: POSTGRES_USER,
//   password: POSTGRES_PASSWORD,
//   database: `${POSTGRES_DB}-test`,
// };

// let appDataSource: DataSource;
// let queryRunner: QueryRunner;

// global.beforeAll(async () => {
//   const dataSource: DataSource = new DataSource(dbInfo);

//   appDataSource = await dataSource.initialize();
//   queryRunner = appDataSource.createQueryRunner();
//   await queryRunner.manager.query(
//     `
//           INSERT INTO region (name) VALUES
//             ($1)
//           `,
//     [bretagne.name],
//   );
// });

global.beforeEach(() => {
  jest.resetAllMocks();
});

// global.afterAll(async () => {
//   await queryRunner.manager.query(`DELETE FROM region`);
//   await appDataSource.destroy();
//   await global.app?.close();
// });

global.setAppModule = async (
  entity,
  useCase,
  repository,
  repositoryInterface: string,
  controller,
) => {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      // TypeOrmModule.forRoot({
      //   ...dbInfo,
      //   entities: [entity],
      // }),
      // TypeOrmModule.forFeature([entity]),
      AppModule,
    ],
    providers: [
      useCase,
      { provide: repositoryInterface, useClass: repository },
    ],
    controllers: [controller],
  }).compile();

  global.app = module.createNestApplication();
  global.app.init();
};
