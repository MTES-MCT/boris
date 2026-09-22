import { BrsHousingType } from 'src/domain/brs-diffusion-website/brs-diffusion-website.interface';

export interface UpdateBrsDiffusionWebsiteParams {
  id: string;
  source: string;
  distributorName?: string | null;
  ofsName?: string | null;
  programName?: string;
  city: string;
  address?: string;
  inseeCode?: string;
  deliveryMonth?: string;
  ofsId?: string | null;
  distributorId?: string | null;
  housingType?: BrsHousingType;
}
