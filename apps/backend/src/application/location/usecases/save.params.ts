import { LeadNotificationOptions } from 'src/domain/ofs/lead-notification-options';
export interface SaveLocationParams extends LeadNotificationOptions {
  name: string;
  latitude: number;
  longitude: number;
  city: string;
  citycode: string;
  label: string;
  municipality: string;
  postalCode: string;
  eligibilitySimulationId?: string;
}
