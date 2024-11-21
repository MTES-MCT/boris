export type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type BackgroundClasss =
  | ''
  | 'fr-background-default--grey'
  | 'fr-background-alt--grey'
  | 'fr-background-alt--blue-france'
  | 'fr-background-alt--red-marianne'
  | 'fr-background-alt--green-tilleul-verveine'
  | 'fr-background-alt--green-bourgeon'
  | 'fr-background-alt--green-emeraude'
  | 'fr-background-alt--green-menthe'
  | 'fr-background-alt--green-archipel'
  | 'fr-background-alt--blue-ecume'
  | 'fr-background-alt--blue-cumulus'
  | 'fr-background-alt--purple-glycine'
  | 'fr-background-alt--pink-macaron'
  | 'fr-background-alt--pink-tuile'
  | 'fr-background-alt--yellow-tournesol'
  | 'fr-background-alt--yellow-moutarde'
  | 'fr-background-alt--orange-terre-battue'
  | 'fr-background-alt--brown-cafe-creme'
  | 'fr-background-alt--brown-caramel'
  | 'fr-background-alt--brown-opera'
  | 'fr-background-alt--beige-gris-galet'
  | 'fr-background-contrast--grey'
  | 'fr-background-contrast--blue-france'
  | 'fr-background-contrast--red-marianne'
  | 'fr-background-contrast--green-tilleul-verveine'
  | 'fr-background-contrast--green-bourgeon'
  | 'fr-background-contrast--green-emeraude'
  | 'fr-background-contrast--green-menthe'
  | 'fr-background-contrast--green-archipel'
  | 'fr-background-contrast--blue-ecume'
  | 'fr-background-contrast--blue-cumulus'
  | 'fr-background-contrast--purple-glycine'
  | 'fr-background-contrast--pink-macaron'
  | 'fr-background-contrast--pink-tuile'
  | 'fr-background-contrast--yellow-tournesol'
  | 'fr-background-contrast--yellow-moutarde'
  | 'fr-background-contrast--orange-terre-battue'
  | 'fr-background-contrast--brown-cafe-creme'
  | 'fr-background-contrast--brown-caramel'
  | 'fr-background-contrast--brown-opera'
  | 'fr-background-contrast--beige-gris-galet'
  | 'fr-background-contrast--info'
  | 'fr-background-contrast--success'
  | 'fr-background-contrast--warning'
  | 'fr-background-contrast--error'
  | 'fr-background-flat--grey'
  | 'fr-background-flat--blue-france'
  | 'fr-background-flat--red-marianne'
  | 'fr-background-flat--green-tilleul-verveine'
  | 'fr-background-flat--green-bourgeon'
  | 'fr-background-flat--green-emeraude'
  | 'fr-background-flat--green-menthe'
  | 'fr-background-flat--green-archipel'
  | 'fr-background-flat--blue-ecume'
  | 'fr-background-flat--blue-cumulus'
  | 'fr-background-flat--purple-glycine'
  | 'fr-background-flat--pink-macaron'
  | 'fr-background-flat--pink-tuile'
  | 'fr-background-flat--yellow-tournesol'
  | 'fr-background-flat--yellow-moutarde'
  | 'fr-background-flat--orange-terre-battue'
  | 'fr-background-flat--brown-cafe-creme'
  | 'fr-background-flat--brown-caramel'
  | 'fr-background-flat--brown-opera'
  | 'fr-background-flat--beige-gris-galet'
  | 'fr-background-flat--info'
  | 'fr-background-flat--success'
  | 'fr-background-flat--warning'
  | 'fr-background-flat--error'
  | 'fr-background-action-high--grey'
  | 'fr-background-action-high--blue-france'
  | 'fr-background-action-high--red-marianne'
  | 'fr-background-action-high--green-tilleul-verveine'
  | 'fr-background-action-high--green-bourgeon'
  | 'fr-background-action-high--green-emeraude'
  | 'fr-background-action-high--green-menthe'
  | 'fr-background-action-high--green-archipel'
  | 'fr-background-action-high--blue-ecume'
  | 'fr-background-action-high--blue-cumulus'
  | 'fr-background-action-high--purple-glycine'
  | 'fr-background-action-high--pink-macaron'
  | 'fr-background-action-high--pink-tuile'
  | 'fr-background-action-high--yellow-tournesol'
  | 'fr-background-action-high--yellow-moutarde'
  | 'fr-background-action-high--orange-terre-battue'
  | 'fr-background-action-high--brown-cafe-creme'
  | 'fr-background-action-high--brown-caramel'
  | 'fr-background-action-high--brown-opera'
  | 'fr-background-action-high--beige-gris-galet'
  | 'fr-background-action-high--info'
  | 'fr-background-action-high--success'
  | 'fr-background-action-high--warning'
  | 'fr-background-action-high--error'
  | 'fr-background-action-low--blue-france'
  | 'fr-background-action-low--red-marianne'
  | 'fr-background-action-low--green-tilleul-verveine'
  | 'fr-background-action-low--green-bourgeon'
  | 'fr-background-action-low--green-emeraude'
  | 'fr-background-action-low--green-menthe'
  | 'fr-background-action-low--green-archipel'
  | 'fr-background-action-low--blue-ecume'
  | 'fr-background-action-low--blue-cumulus'
  | 'fr-background-action-low--purple-glycine'
  | 'fr-background-action-low--pink-macaron'
  | 'fr-background-action-low--pink-tuile'
  | 'fr-background-action-low--yellow-tournesol'
  | 'fr-background-action-low--yellow-moutarde'
  | 'fr-background-action-low--orange-terre-battue'
  | 'fr-background-action-low--brown-cafe-creme'
  | 'fr-background-action-low--brown-caramel'
  | 'fr-background-action-low--brown-opera'
  | 'fr-background-action-low--beige-gris-galet';

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

export type BlogPost = {
  title: string;
  description: string;
  firstPublishedAt: string;
  slug: string;
  body?: WagtailApiItemResponseBody[];
};

export type EligibilityData = {
  category: {
    small: string;
    long: string;
  };
  zoneAandAbis: number;
  zoneB1: number;
  zoneB2andC: number;
  content: string;
  contentHtml?: string;
};
