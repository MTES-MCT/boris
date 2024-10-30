export type Ofs = {
  nom: string;
  region: string;
  departements: string;
  lien: string;
};

export type Props = {
  data: {
    ofsList: Ofs[];
  };
};
