export interface CreateOfsUsecaseParams {
  name: string;
  phone?: string;
  websiteUrl?: string;
  email?: string;
  producesBrs?: boolean;
  departementNames: string[];
  regionNames: string[];
  distributorIds: string[];
}
