import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEligibilitySimulationAndLocationTable1772119754663
  implements MigrationInterface
{
  name = 'CreateEligibilitySimulationAndLocationTable1772119754663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."eligibility_simulation_propertysituation_enum" AS ENUM('LOCATAIRE_SOCIAL', 'LOCATAIRE_PRIVE', 'PROPRIETAIRE', 'HEBERGE', 'AUTRE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eligibility_simulation_declarationtype_enum" AS ENUM('SEUL_SOUHAIT_SEUL', 'SEUL_SOUHAIT_PARTENAIRE', 'COMMUN')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eligibility_simulation_housingtype_enum" AS ENUM('T1', 'T2', 'T3', 'T4', 'T5')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eligibility_simulation_employmentstatus_enum" AS ENUM('SALARIE_PRIVE_NON_AGRICOLE', 'SALARIE_AGRICOLE', 'SALARIE_PUBLIC_OU_FONCTIONNAIRE', 'INDEPENDANT', 'SALARIE_GROUPE_LA_POSTE', 'SANS_ACTIVITE_PROFESSIONNELLE', 'RETRAITE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eligibility_simulation_positiontype_enum" AS ENUM('CADRE', 'NON_CADRE', 'NO_CATEGORIE_PROFESSIONNELLE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."eligibility_simulation_positioncontracttype_enum" AS ENUM('CDI', 'CDD')`,
    );
    await queryRunner.query(
      `CREATE TABLE "eligibility_simulation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "householdSize" integer, "hasDisability" boolean, "propertySituation" "public"."eligibility_simulation_propertysituation_enum", "dependantsAmount" integer, "birthday" date, "coBuyerBirthday" date, "taxableIncome" integer, "declarationType" "public"."eligibility_simulation_declarationtype_enum", "firstCoBuyerTaxableIncome" integer, "secondCoBuyerTaxableIncome" integer, "eligibility" json, "firstName" character varying, "lastName" character varying, "email" character varying, "phone" character varying, "hasRefusedConnection" boolean, "housingType" "public"."eligibility_simulation_housingtype_enum", "contribution" integer, "resources" integer, "hadBrsKnowledge" boolean, "employmentStatus" "public"."eligibility_simulation_employmentstatus_enum", "laposteEmployer" character varying, "canSendInformationsToLaposte" boolean, "positionType" "public"."eligibility_simulation_positiontype_enum", "positionStage" boolean, "hasCompanyMoreThan10Employees" boolean, "hasCompanyMoreThan50Employees" boolean, "allowFinancingAndOwnershipAdvices" boolean, "positionContractType" "public"."eligibility_simulation_positioncontracttype_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7ea02da4531ba77b3b8255d5a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "city" character varying NOT NULL, "citycode" character varying NOT NULL, "label" character varying NOT NULL, "municipality" character varying NOT NULL, "postalCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "departementId" uuid, "eligibilitySimulationId" uuid, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_7c06c57cd548bbaf0159435c12d" FOREIGN KEY ("departementId") REFERENCES "departement"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_5bc5b505ef707ce22152934b541" FOREIGN KEY ("eligibilitySimulationId") REFERENCES "eligibility_simulation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_5bc5b505ef707ce22152934b541"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_7c06c57cd548bbaf0159435c12d"`,
    );
    await queryRunner.query(`DROP TABLE "location"`);
    await queryRunner.query(`DROP TABLE "eligibility_simulation"`);
    await queryRunner.query(
      `DROP TYPE "public"."eligibility_simulation_positioncontracttype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."eligibility_simulation_positiontype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."eligibility_simulation_employmentstatus_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."eligibility_simulation_housingtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."eligibility_simulation_declarationtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."eligibility_simulation_propertysituation_enum"`,
    );
  }
}
