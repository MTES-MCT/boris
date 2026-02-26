import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  UpdateEligibilitySimulationDTO,
  UpdateEligibilitySimulationEligibilityDTO,
  UpdateEligibilitySimulationLocationDTO,
} from 'src/infrastructure/eligibility-simulation/dtos/update.dto';

describe('UpdateEligibilitySimulationDTO', () => {
  it('should be valid with no fields (all optional)', async () => {
    const dto = new UpdateEligibilitySimulationDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with all fields', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.householdSize = 3;
    dto.hasDisability = false;
    dto.dependantsAmount = 1;
    dto.birthday = new Date('1990-05-15');
    dto.coBuyerBirthday = new Date('1988-03-20');
    dto.propertySituation = 'LOCATAIRE_SOCIAL';
    dto.taxableIncome = 30000;
    dto.declarationType = 'SEUL_SOUHAIT_SEUL';
    dto.firstCoBuyerTaxableIncome = 0;
    dto.secondCoBuyerTaxableIncome = 0;
    dto.eligibility = Object.assign(
      new UpdateEligibilitySimulationEligibilityDTO(),
      {
        category: 1,
        eligibleZoneAandAbis: true,
        eligibleZoneB1: false,
        eligibleZoneB2andC: false,
      },
    );
    dto.firstName = 'Jean';
    dto.lastName = 'Dupont';
    dto.email = 'jean@example.com';
    dto.phone = '0612345678';
    dto.hasRefusedConnection = false;
    dto.housingType = 'T3';
    dto.contribution = 10000;
    dto.resources = 20000;
    dto.hadBrsKnowledge = true;
    dto.employmentStatus = 'SALARIE_PRIVE_NON_AGRICOLE';
    dto.laposteEmployer = 'Non';
    dto.canSendInformationsToLaposte = false;
    dto.positionType = 'CADRE';
    dto.positionStage = false;
    dto.hasCompanyMoreThan10Employees = true;
    dto.hasCompanyMoreThan50Employees = false;
    dto.allowFinancingAndOwnershipAdvices = true;
    dto.positionContractType = 'CDI';
    dto.locations = [
      Object.assign(new UpdateEligibilitySimulationLocationDTO(), {
        latitude: 48.8566,
        longitude: 2.3522,
        city: 'Paris',
        citycode: '75101',
        label: 'Paris',
        municipality: 'Paris',
        postalCode: '75001',
        departementId: '123e4567-e89b-12d3-a456-426614174000',
      }),
    ];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with only some fields', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.propertySituation = 'PROPRIETAIRE';
    dto.taxableIncome = 25000;
    dto.firstName = 'Marie';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with household composition and birthdate fields only', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.householdSize = 4;
    dto.hasDisability = true;
    dto.dependantsAmount = 2;
    dto.birthday = new Date('1985-01-10');
    dto.coBuyerBirthday = new Date('1987-06-22');

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be invalid when householdSize is zero', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.householdSize = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('householdSize');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when householdSize is negative', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.householdSize = -1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('householdSize');
    expect(errors[0].constraints).toHaveProperty('isPositive');
  });

  it('should be invalid when hasDisability is not a boolean', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.householdSize = 1;
    // @ts-expect-error: testing non-boolean value
    dto.hasDisability = 'yes';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('hasDisability');
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should be invalid when birthday is not a valid Date', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.householdSize = 1;
    // @ts-expect-error: testing non-Date value
    dto.birthday = '1990-01-01';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('birthday');
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('should be invalid when coBuyerBirthday is not a valid Date', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.householdSize = 1;
    // @ts-expect-error: testing non-Date value
    dto.coBuyerBirthday = '1988-03-20';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('coBuyerBirthday');
    expect(errors[0].constraints).toHaveProperty('isDate');
  });

  it('should be invalid when propertySituation is not in allowed values', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.propertySituation = 'INVALID';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('propertySituation');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when taxableIncome is negative', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.taxableIncome = -1000;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('taxableIncome');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should be invalid when declarationType is not in allowed values', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.declarationType = 'INVALID';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('declarationType');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when firstCoBuyerTaxableIncome is negative', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.firstCoBuyerTaxableIncome = -1;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('firstCoBuyerTaxableIncome');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should be invalid when housingType is not in allowed values', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.housingType = 'INVALID';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('housingType');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when contribution is negative', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.contribution = -5000;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('contribution');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should be invalid when resources is negative', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.resources = -1000;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('resources');
    expect(errors[0].constraints).toHaveProperty('min');
  });

  it('should be invalid when employmentStatus is not in allowed values', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.employmentStatus = 'INVALID';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('employmentStatus');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when positionType is not in allowed values', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.positionType = 'INVALID';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('positionType');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when positionContractType is not in allowed values', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    // @ts-expect-error: testing invalid enum value
    dto.positionContractType = 'INVALID';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('positionContractType');
    expect(errors[0].constraints).toHaveProperty('isIn');
  });

  it('should be invalid when hasRefusedConnection is not a boolean', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    // @ts-expect-error: testing non-boolean value
    dto.hasRefusedConnection = 'hello';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('hasRefusedConnection');
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should be invalid when hasCompanyMoreThan10Employees is not a boolean', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    // @ts-expect-error: testing non-boolean value
    dto.hasCompanyMoreThan10Employees = 'yes';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('hasCompanyMoreThan10Employees');
    expect(errors[0].constraints).toHaveProperty('isBoolean');
  });

  it('should be valid with all allowed propertySituation values', async () => {
    const allowed = [
      'LOCATAIRE_SOCIAL',
      'LOCATAIRE_PRIVE',
      'PROPRIETAIRE',
      'HEBERGE',
      'AUTRE',
    ];

    for (const value of allowed) {
      const dto = new UpdateEligibilitySimulationDTO();
      dto.propertySituation = value as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be valid with all allowed housingType values', async () => {
    const allowed = ['T1', 'T2', 'T3', 'T4', 'T5'];

    for (const value of allowed) {
      const dto = new UpdateEligibilitySimulationDTO();
      dto.housingType = value as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be valid with all allowed positionContractType values', async () => {
    const allowed = ['CDI', 'CDD'];

    for (const value of allowed) {
      const dto = new UpdateEligibilitySimulationDTO();
      dto.positionContractType = value as any;

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    }
  });

  it('should be valid with nested eligibility', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.eligibility = Object.assign(
      new UpdateEligibilitySimulationEligibilityDTO(),
      {
        category: 2,
        eligibleZoneAandAbis: false,
        eligibleZoneB1: true,
        eligibleZoneB2andC: false,
      },
    );

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with locations array', async () => {
    const dto = new UpdateEligibilitySimulationDTO();
    dto.locations = [
      Object.assign(new UpdateEligibilitySimulationLocationDTO(), {
        latitude: 48.8,
        longitude: 2.3,
        city: 'Lyon',
        citycode: '69123',
        label: 'Lyon',
        municipality: 'Lyon',
        postalCode: '69001',
        departementId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      }),
    ];

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should transform string "true" to boolean for boolean fields when using plainToInstance', async () => {
    const plain = {
      hasRefusedConnection: 'true',
      hadBrsKnowledge: 'false',
    };
    const dto = plainToInstance(UpdateEligibilitySimulationDTO, plain);

    expect(dto.hasRefusedConnection).toBe(true);
    expect(dto.hadBrsKnowledge).toBe(false);

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('UpdateEligibilitySimulationEligibilityDTO', () => {
  it('should be valid with all optional fields', async () => {
    const dto = new UpdateEligibilitySimulationEligibilityDTO();
    dto.category = 1;
    dto.eligibleZoneAandAbis = true;
    dto.eligibleZoneB1 = false;
    dto.eligibleZoneB2andC = true;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with no fields', async () => {
    const dto = new UpdateEligibilitySimulationEligibilityDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});

describe('UpdateEligibilitySimulationLocationDTO', () => {
  it('should be valid with all optional fields', async () => {
    const dto = new UpdateEligibilitySimulationLocationDTO();
    dto.latitude = 48.8566;
    dto.longitude = 2.3522;
    dto.city = 'Paris';
    dto.citycode = '75101';
    dto.label = 'Paris';
    dto.municipality = 'Paris';
    dto.postalCode = '75001';

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should be valid with no fields', async () => {
    const dto = new UpdateEligibilitySimulationLocationDTO();

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
