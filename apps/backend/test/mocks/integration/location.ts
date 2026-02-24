import { LocationEntity } from 'src/infrastructure/location/location.entity';
import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';
import { finistere } from './departement';

const eligibilitySimulation = new EligibilitySimulationEntity();
eligibilitySimulation.id = 'sim-uuid';

export const mockedLocation = Object.assign(new LocationEntity(), {
  id: 'location-uuid',
  latitude: 48.3905,
  longitude: -4.486,
  city: 'Brest',
  citycode: '29019',
  label: 'Brest',
  municipality: 'Brest',
  postalCode: '29200',
  departement: finistere,
  eligibilitySimulation,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
});
