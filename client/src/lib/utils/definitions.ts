export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type WagtailApiItemsResponse = {
  meta: {
    total_count: number;
  };
  items: WagtailApiItemResponse[];
};

export type WagtailApiItemResponse = {
  id: number;
  meta: {
    type: string;
    slug: string;
    first_published_at: string;
    search_description: string;
    download_url: string;
  };
  title: string;
  body?: WagtailApiItemResponseBody[];
};

export type WagtailApiItemResponseBody = {
  id: string;
  type: 'paragraph' | 'image';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

export type Article = {
  title: string;
  description: string;
  firstPublishedAt: string;
  slug: string;
  body?: WagtailApiItemResponseBody[];
};

export type EligibilityData = {
  category: string;
  value: number;
  options: string[];
  zoneAandAbis: number;
  zoneB1: number;
  zoneB2andC: number;
};

export type Statistic = {
  amount: string;
  subtitle: string;
  content: string;
};

export type StepSection = {
  id: string;
  title: string;
  content: string;
};

export type Step = {
  title: string;
  description: string;
  slug: string;
  sections: StepSection[];
  previousStep?: {
    title: string;
    slug: string;
  };
  nextStep?: {
    title: string;
    slug: string;
  };
};

export type OFS = {
  nom: string;
  region: string;
  departements: string;
  commercialisateur: string;
  lien: string;
  telephone: string;
  formattedCommercialisateurs?: FormattedCommercialisateurs[];
};

export type FormattedCommercialisateurs = {
  nom: string;
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
  // TEMPORAIRE À SUPPRIMER QUAND NOUS AURONS TOUS LES DÉPARTEMENTS.
  OFSs: OFS[];
  //

  // TEMPORAIRE: À REMETTRE QUAND NOUS AURONS TOUS LES DEPARTEMENTS
  // departements: Departement[];
};
