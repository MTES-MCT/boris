export type OFS = {
  nom: string;
  region: string;
  departements: string;
  commercialisateur: string;
  lien: string;
  telephone: string;
};

export type Departement = {
  name: string;
  totalOFSs: number;
  OFSs: OFS[];
};

export type Region = {
  name: string;
  totalOFSs: number;
  // TEMPORAIRE À SUPPRIMER QUAND NOUS AURONS TOUS LES DÉPARTEMENTS.
  OFSs: OFS[];
  //

  // TEMPORAIRE: À REMETTRE QUAND NOUS AURONS TOUS LES DEPARTEMENTS
  // departements: Departement[];
};

export type Props = {
  data: {
    regions: Region[];
  };
};
