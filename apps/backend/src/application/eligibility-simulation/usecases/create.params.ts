export interface CreateEligibilitySimulationParams {
  householdSize: number;
  hasDisability: boolean;
  dependantsAmount?: number;
  birthday?: Date;
  coBuyerBirthday?: Date;
}
