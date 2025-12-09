export interface UpdateOfsUsecaseParams {
  id: string;
  name: string;
  phone?: string;
  websiteUrl?: string;
  email?: string;
  producesBrs?: boolean;
  isPartner?: boolean;
  departementNames: string[];
  regionNames: string[];
  distributorIds: string[];
}
