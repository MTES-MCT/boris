import { DepartementInterface } from '../departement/departement.interface';
import { EligibilitySimulationInterface } from '../eligibility-simulation/eligibility-simulation.interface';

export interface LocationInterface {
  id: string;
  latitude: number;
  longitude: number;
  city: string;
  citycode: string;
  label: string;
  municipality: string;
  postalCode: string;
  departement: DepartementInterface;
  eligibilitySimulation: EligibilitySimulationInterface;
  createdAt: Date;
  updatedAt: Date;
}
