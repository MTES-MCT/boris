import type { components } from './generated-api-types';

export type Pagination<T> = Omit<
  components['schemas']['Pagination'],
  'items'
> & {
  items: T[];
};

export type OfsView = Omit<
  components['schemas']['OfsView'],
  'websiteUrl' | 'phone' | 'email'
> & {
  websiteUrl: string | null;
  phone: string | null;
  email: string | null;
};

export type BrsDiffusionWebsiteView =
  components['schemas']['BrsDiffusionWebsiteView'];
