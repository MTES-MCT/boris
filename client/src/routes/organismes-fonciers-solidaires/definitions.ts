export type OFS = {
  nom: string;
  region: string;
  departements: string;
  lien: string;
};

export type Departement = {
  name: string;
  OFSs: OFS[];
};

export type Region = {
  name: string;
  departements: Departement[];
};

export type Props = {
  data: {
    regions: Region[];
  };
};
