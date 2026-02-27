import type { components, operations } from './generated-api-types';

export type Pagination<T> = Omit<
  components['schemas']['Pagination'],
  'items'
> & {
  items: T[];
};

export type OfsView = Omit<
  components['schemas']['OfsView'],
  'websiteUrl' | 'phone' | 'email' | 'producesBrs' | 'isPartner'
> & {
  websiteUrl: string | null;
  phone: string | null;
  email: string | null;
  producesBrs: boolean | null;
  isPartner: boolean | null;
};

export type BrsDiffusionWebsiteView =
  components['schemas']['BrsDiffusionWebsiteView'];

export type RegionRelationnalView =
  components['schemas']['RegionRelationnalView'];

export type DepartementRelationnalView =
  components['schemas']['DepartementRelationnalView'];

export type MunicipalityView = components['schemas']['MunicipalityView'];

export type AcquisitionSimulationView =
  components['schemas']['AcquisitionSimulationView'];

export type EligibilitySimulationView =
  components['schemas']['EligibilitySimulationView'];

export type CreateAcquisitionSimulationDto =
  components['schemas']['CreateAcquisitionSimulationDTO'];

export type UpdateAcquisitionSimulationDto =
  components['schemas']['UpdateAcquisitionSimulationDTO'];

export type GetLandbotCustomerByFieldsPathParams =
  operations['GetLandbotCustomersByFieldApiController_index']['parameters']['path']['field'];

export type LandbotCustomerGroupSimulationsByYearAndMonthView =
  components['schemas']['LandbotCustomerGroupSimulationsByYearAndMonthView'];

export type CreateEligibilitySimulationDto =
  components['schemas']['CreateEligibilitySimulationDTO'];

export type UpdateEligibilitySimulationDto =
  components['schemas']['UpdateEligibilitySimulationDTO'];
