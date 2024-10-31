export type OFS = {
  nom: string;
  region: string;
  departements: string;
  lien: string;
};

export type Departement = {
  name: string;
  totalOFSs: number;
  OFSs: OFS[];
};

export type Region = {
  name: string;
  totalOFSs: number;
  departements: Departement[];
};

export type Props = {
  data: {
    regions: Region[];
  };
};
