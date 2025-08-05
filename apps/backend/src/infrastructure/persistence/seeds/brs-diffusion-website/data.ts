export interface BrsDiffusionWebsite {
  source: string;
  commune: string;
  commercialisateur: string;
  ofs: string;
}

export const brsDiffusionWebsites: BrsDiffusionWebsite[] = [
  {
    source: 'https://www.iceo-habitat.fr/programme/',
    commune: 'Angers',
    commercialisateur: 'Iceo',
    ofs: 'OFS Racines',
  },
  {
    source: 'https://keredes.coop/achat/neuf/',
    commune: 'Vannes',
    commercialisateur: 'Keredes',
    ofs: 'Foncier Coopératif Malouin',
  },
  {
    source: 'https://keredes.coop/achat/neuf/',
    commune: 'Rennes',
    commercialisateur: 'Keredes',
    ofs: 'Foncier Coopératif Malouin',
  },
];
