const regions = [
  {
    nom: 'Auvergne-Rhône-Alpes',
    departements: [
      { nom: 'Ain', code: '01' },
      { nom: 'Allier', code: '03' },
      { nom: 'Ardèche', code: '07' },
      { nom: 'Cantal', code: '15' },
      { nom: 'Drôme', code: '26' },
      { nom: 'Isère', code: '38' },
      { nom: 'Loire', code: '42' },
      { nom: 'Haute-Loire', code: '43' },
      { nom: 'Puy-de-Dôme', code: '63' },
      { nom: 'Rhône', code: '69' },
      { nom: 'Savoie', code: '73' },
      { nom: 'Haute-Savoie', code: '74' },
    ],
  },
  {
    nom: 'Bourgogne-Franche-Comté',
    departements: [
      { nom: "Côte-d'Or", code: '21' },
      { nom: 'Doubs', code: '25' },
      { nom: 'Jura', code: '39' },
      { nom: 'Nièvre', code: '58' },
      { nom: 'Haute-Saône', code: '70' },
      { nom: 'Saône-et-Loire', code: '71' },
      { nom: 'Yonne', code: '89' },
      { nom: 'Territoire de Belfort', code: '90' },
    ],
  },
  {
    nom: 'Bretagne',
    departements: [
      { nom: "Côtes-d'Armor", code: '22' },
      { nom: 'Finistère', code: '29' },
      { nom: 'Ille-et-Vilaine', code: '35' },
      { nom: 'Morbihan', code: '56' },
    ],
  },
  {
    nom: 'Centre-Val de Loire',
    departements: [
      { nom: 'Cher', code: '18' },
      { nom: 'Eure-et-Loir', code: '28' },
      { nom: 'Indre', code: '36' },
      { nom: 'Indre-et-Loire', code: '37' },
      { nom: 'Loir-et-Cher', code: '41' },
      { nom: 'Loiret', code: '45' },
    ],
  },
  {
    nom: 'Corse',
    departements: [
      { nom: 'Corse-du-Sud', code: '2A' },
      { nom: 'Haute-Corse', code: '2B' },
    ],
  },
  {
    nom: 'Grand Est',
    departements: [
      { nom: 'Ardennes', code: '08' },
      { nom: 'Aube', code: '10' },
      { nom: 'Marne', code: '51' },
      { nom: 'Haute-Marne', code: '52' },
      { nom: 'Meurthe-et-Moselle', code: '54' },
      { nom: 'Meuse', code: '55' },
      { nom: 'Moselle', code: '57' },
      { nom: 'Bas-Rhin', code: '67' },
      { nom: 'Haut-Rhin', code: '68' },
      { nom: 'Vosges', code: '88' },
    ],
  },
  {
    nom: 'Hauts-de-France',
    departements: [
      { nom: 'Aisne', code: '02' },
      { nom: 'Nord', code: '59' },
      { nom: 'Oise', code: '60' },
      { nom: 'Pas-de-Calais', code: '62' },
      { nom: 'Somme', code: '80' },
    ],
  },
  {
    nom: 'Île-de-France',
    departements: [
      { nom: 'Paris', code: '75' },
      { nom: 'Seine-et-Marne', code: '77' },
      { nom: 'Yvelines', code: '78' },
      { nom: 'Essonne', code: '91' },
      { nom: 'Hauts-de-Seine', code: '92' },
      { nom: 'Seine-Saint-Denis', code: '93' },
      { nom: 'Val-de-Marne', code: '94' },
      { nom: "Val-d'Oise", code: '95' },
    ],
  },
  {
    nom: 'Normandie',
    departements: [
      { nom: 'Calvados', code: '14' },
      { nom: 'Eure', code: '27' },
      { nom: 'Manche', code: '50' },
      { nom: 'Orne', code: '61' },
      { nom: 'Seine-Maritime', code: '76' },
    ],
  },
  {
    nom: 'Nouvelle-Aquitaine',
    departements: [
      { nom: 'Charente', code: '16' },
      { nom: 'Charente-Maritime', code: '17' },
      { nom: 'Corrèze', code: '19' },
      { nom: 'Creuse', code: '23' },
      { nom: 'Deux-Sèvres', code: '79' },
      { nom: 'Dordogne', code: '24' },
      { nom: 'Gironde', code: '33' },
      { nom: 'Landes', code: '40' },
      { nom: 'Lot-et-Garonne', code: '47' },
      { nom: 'Pyrénées-Atlantiques', code: '64' },
      { nom: 'Haute-Vienne', code: '87' },
      { nom: 'Vienne', code: '86' },
      { nom: 'Corrèze', code: '19' },
    ],
  },
  {
    nom: 'Occitanie',
    departements: [
      { nom: 'Ariège', code: '09' },
      { nom: 'Aude', code: '11' },
      { nom: 'Aveyron', code: '12' },
      { nom: 'Gard', code: '30' },
      { nom: 'Haute-Garonne', code: '31' },
      { nom: 'Gers', code: '32' },
      { nom: 'Hérault', code: '34' },
      { nom: 'Lot', code: '46' },
      { nom: 'Lozère', code: '48' },
      { nom: 'Pyrénées-Orientales', code: '66' },
      { nom: 'Tarn', code: '81' },
      { nom: 'Tarn-et-Garonne', code: '82' },
    ],
  },
  {
    nom: 'Pays de la Loire',
    departements: [
      { nom: 'Loire-Atlantique', code: '44' },
      { nom: 'Maine-et-Loire', code: '49' },
      { nom: 'Mayenne', code: '53' },
      { nom: 'Sarthe', code: '72' },
      { nom: 'Vendée', code: '85' },
    ],
  },
  {
    nom: "Provence-Alpes-Côte d'Azur",
    departements: [
      { nom: 'Alpes-de-Haute-Provence', code: '04' },
      { nom: 'Hautes-Alpes', code: '05' },
      { nom: 'Alpes-Maritimes', code: '06' },
      { nom: 'Bouches-du-Rhône', code: '13' },
      { nom: 'Var', code: '83' },
      { nom: 'Vaucluse', code: '84' },
    ],
  },
  {
    nom: 'Guadeloupe',
    departements: [{ nom: 'Guadeloupe', code: '971' }],
  },
  {
    nom: 'Martinique',
    departements: [{ nom: 'Martinique', code: '972' }],
  },
  {
    nom: 'Guyane',
    departements: [{ nom: 'Guyane', code: '973' }],
  },
  {
    nom: 'La Réunion',
    departements: [{ nom: 'La Réunion', code: '974' }],
  },
  {
    nom: 'Mayotte',
    departements: [{ nom: 'Mayotte', code: '976' }],
  },
  {
    nom: 'Saint-Pierre-et-Miquelon',
    departements: [{ nom: 'Saint-Pierre-et-Miquelon', code: '975' }],
  },
  {
    nom: 'Polynésie Française',
    departements: [{ nom: 'Polynésie Française', code: '987' }],
  },
  {
    nom: 'Nouvelle-Calédonie',
    departements: [{ nom: 'Nouvelle-Calédonie', code: '988' }],
  },
  {
    nom: 'Wallis-et-Futuna',
    departements: [{ nom: 'Wallis-et-Futuna', code: '986' }],
  },
  {
    nom: 'Terres australes et antarctiques françaises',
    departements: [
      { nom: 'Terres australes et antarctiques françaises', code: '984' },
    ],
  },
  {
    nom: 'Saint-Barthélemy',
    departements: [{ nom: 'Saint-Barthélemy', code: '977' }],
  },
  {
    nom: 'Saint-Martin',
    departements: [{ nom: 'Saint-Martin', code: '978' }],
  },
];

import { SaveRegionUsecase } from 'src/application/region/save.usecase';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { RegionEntity } from 'src/infrastructure/region/region.entity';

export class RegionsDepartementsSeed {
  constructor(private readonly saveRegionUseCase: SaveRegionUsecase) {}

  async seed() {
    const createRegionPromises = regions.map((region) => {
      const departements = region.departements.map(
        (departement) =>
          new DepartementEntity(departement.nom, departement.code),
      );

      const createdRegion = new RegionEntity(region.nom, departements);

      return this.saveRegionUseCase.execute(createdRegion);
    });

    await Promise.all(createRegionPromises);

    console.log('Regions and departements created');
  }
}
