export type AutocompleteSuggestion = {
  country: string;
  city: string;
  x: number;
  y: number;
  zipcode: string;
  street: string;
  classification: number;
  kind: string;
  fulltext: string;
  metropole: boolean;
  poiType: 'région' | 'département'[];
  id?: string;
};

export type AutocompleteResponse = {
  status: number;
  results: AutocompleteSuggestion[];
};
