export interface UpdateOfsUsecaseParams {
  id: string;
  name: string;
  phone?: string;
  websiteUrl?: string;
  email?: string;
  departementNames: string[];
  regionNames: string[];
  distributorIds: string[];
}
