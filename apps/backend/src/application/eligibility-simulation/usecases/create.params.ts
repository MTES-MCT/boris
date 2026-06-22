export interface CreateEligibilitySimulationParams {
  householdSize: number;
  hasDisability?: boolean;
  dependantsAmount?: number;
  birthday?: Date;
  coBuyerBirthday?: Date;
  isFromLandbot?: boolean;
  landbotDate?: Date;
  sourceType?: 'BORIS_PUBLIC' | 'OFS_EMBED';
  sourceOfsId?: string | null;
}
