import type { OfsView } from './api-types';
import type {
  components,
  operations,
} from './generated-address-datagouv-types';
import type { pictograms } from './pictograms';

export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

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
  pictogram: keyof typeof pictograms;
};

export type StepSection = {
  id: string;
  title: string;
  content: string;
};

export type Step = {
  title: string;
  headTitle: string;
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

export type Region = {
  name: string;
  totalOfss: number;
  ofss: OfsView[];
};

export type ArticlePreview = {
  title: string;
  description: string;
  slug: string;
  firstPublishedAt: string;
};

export type GeocodedResponse = components['schemas']['Address'];
export type GeocodedSearchApiResponse =
  operations['search']['responses']['200']['content']['application/json'] & {
    features: GeocodedResponse[];
  };

export type ZoneABC = {
  codeinsee: string;
  departement: string;
  nom: string;
  zoneabc: string;
};

export type MapBounds = {
  northEastLat: number;
  northEastLng: number;
  southWestLat: number;
  southWestLng: number;
};

export type FormFieldError = {
  [key: string]: string;
};

export type Accent =
  | 'default'
  | 'green-tilleul-verveine'
  | 'green-bourgeon'
  | 'green-emeraude'
  | 'green-menthe'
  | 'green-archipel'
  | 'blue-ecume'
  | 'blue-cumulus'
  | 'purple-glycine'
  | 'pink-macaron'
  | 'pink-tuile'
  | 'yellow-tournesol'
  | 'yellow-moutarde'
  | 'orange-terre-battue'
  | 'brown-cafe-creme'
  | 'brown-caramel'
  | 'brown-opera'
  | 'beige-gris-galet';

export type FontWeight = 'normal' | 'bold' | 'light';
