import type { OfsView } from './api-types';

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
