import { Injectable } from '@nestjs/common';
import { SaveDepartementUsecase } from 'src/application/departement/usecases/save.usecase';
import { SaveRegionUsecase } from 'src/application/region/usecases/save.usecase';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { RegionEntity } from 'src/infrastructure/region/region.entity';

const regions = [
  {
    name: 'Auvergne-Rhône-Alpes',
    departements: [
      { name: 'Ain', code: '01' },
      { name: 'Allier', code: '03' },
      { name: 'Ardèche', code: '07' },
      { name: 'Cantal', code: '15' },
      { name: 'Drôme', code: '26' },
      { name: 'Isère', code: '38' },
      { name: 'Loire', code: '42' },
      { name: 'Haute-Loire', code: '43' },
      { name: 'Puy-de-Dôme', code: '63' },
      { name: 'Rhône', code: '69' },
      { name: 'Savoie', code: '73' },
      { name: 'Haute-Savoie', code: '74' },
    ],
  },
  {
    name: 'Bourgogne-Franche-Comté',
    departements: [
      { name: "Côte-d'Or", code: '21' },
      { name: 'Doubs', code: '25' },
      { name: 'Jura', code: '39' },
      { name: 'Nièvre', code: '58' },
      { name: 'Haute-Saône', code: '70' },
      { name: 'Saône-et-Loire', code: '71' },
      { name: 'Yonne', code: '89' },
      { name: 'Territoire de Belfort', code: '90' },
    ],
  },
  {
    name: 'Bretagne',
    departements: [
      { name: "Côtes-d'Armor", code: '22' },
      { name: 'Finistère', code: '29' },
      { name: 'Ille-et-Vilaine', code: '35' },
      { name: 'Morbihan', code: '56' },
    ],
  },
  {
    name: 'Centre-Val de Loire',
    departements: [
      { name: 'Cher', code: '18' },
      { name: 'Eure-et-Loir', code: '28' },
      { name: 'Indre', code: '36' },
      { name: 'Indre-et-Loire', code: '37' },
      { name: 'Loir-et-Cher', code: '41' },
      { name: 'Loiret', code: '45' },
    ],
  },
  {
    name: 'Corse',
    departements: [
      { name: 'Corse-du-Sud', code: '2A' },
      { name: 'Haute-Corse', code: '2B' },
    ],
  },
  {
    name: 'Grand Est',
    departements: [
      { name: 'Ardennes', code: '08' },
      { name: 'Aube', code: '10' },
      { name: 'Marne', code: '51' },
      { name: 'Haute-Marne', code: '52' },
      { name: 'Meurthe-et-Moselle', code: '54' },
      { name: 'Meuse', code: '55' },
      { name: 'Moselle', code: '57' },
      { name: 'Bas-Rhin', code: '67' },
      { name: 'Haut-Rhin', code: '68' },
      { name: 'Vosges', code: '88' },
    ],
  },
  {
    name: 'Hauts-de-France',
    departements: [
      { name: 'Aisne', code: '02' },
      { name: 'Nord', code: '59' },
      { name: 'Oise', code: '60' },
      { name: 'Pas-de-Calais', code: '62' },
      { name: 'Somme', code: '80' },
    ],
  },
  {
    name: 'Île-de-France',
    departements: [
      { name: 'Paris', code: '75' },
      { name: 'Seine-et-Marne', code: '77' },
      { name: 'Yvelines', code: '78' },
      { name: 'Essonne', code: '91' },
      { name: 'Hauts-de-Seine', code: '92' },
      { name: 'Seine-Saint-Denis', code: '93' },
      { name: 'Val-de-Marne', code: '94' },
      { name: "Val-d'Oise", code: '95' },
    ],
  },
  {
    name: 'Normandie',
    departements: [
      { name: 'Calvados', code: '14' },
      { name: 'Eure', code: '27' },
      { name: 'Manche', code: '50' },
      { name: 'Orne', code: '61' },
      { name: 'Seine-Maritime', code: '76' },
    ],
  },
  {
    name: 'Nouvelle-Aquitaine',
    departements: [
      { name: 'Charente', code: '16' },
      { name: 'Charente-Maritime', code: '17' },
      { name: 'Corrèze', code: '19' },
      { name: 'Creuse', code: '23' },
      { name: 'Deux-Sèvres', code: '79' },
      { name: 'Dordogne', code: '24' },
      { name: 'Gironde', code: '33' },
      { name: 'Landes', code: '40' },
      { name: 'Lot-et-Garonne', code: '47' },
      { name: 'Pyrénées-Atlantiques', code: '64' },
      { name: 'Haute-Vienne', code: '87' },
      { name: 'Vienne', code: '86' },
    ],
  },
  {
    name: 'Occitanie',
    departements: [
      { name: 'Ariège', code: '09' },
      { name: 'Aude', code: '11' },
      { name: 'Aveyron', code: '12' },
      { name: 'Gard', code: '30' },
      { name: 'Haute-Garonne', code: '31' },
      { name: 'Gers', code: '32' },
      { name: 'Hérault', code: '34' },
      { name: 'Lot', code: '46' },
      { name: 'Lozère', code: '48' },
      { name: 'Pyrénées-Orientales', code: '66' },
      { name: 'Tarn', code: '81' },
      { name: 'Tarn-et-Garonne', code: '82' },
    ],
  },
  {
    name: 'Pays de la Loire',
    departements: [
      { name: 'Loire-Atlantique', code: '44' },
      { name: 'Maine-et-Loire', code: '49' },
      { name: 'Mayenne', code: '53' },
      { name: 'Sarthe', code: '72' },
      { name: 'Vendée', code: '85' },
    ],
  },
  {
    name: "Provence-Alpes-Côte d'Azur",
    departements: [
      { name: 'Alpes-de-Haute-Provence', code: '04' },
      { name: 'Hautes-Alpes', code: '05' },
      { name: 'Alpes-Maritimes', code: '06' },
      { name: 'Bouches-du-Rhône', code: '13' },
      { name: 'Var', code: '83' },
      { name: 'Vaucluse', code: '84' },
    ],
  },
  {
    name: 'Guadeloupe',
    departements: [{ name: 'Guadeloupe', code: '971' }],
  },
  {
    name: 'Martinique',
    departements: [{ name: 'Martinique', code: '972' }],
  },
  {
    name: 'Guyane',
    departements: [{ name: 'Guyane', code: '973' }],
  },
  {
    name: 'La Réunion',
    departements: [{ name: 'La Réunion', code: '974' }],
  },
  {
    name: 'Mayotte',
    departements: [{ name: 'Mayotte', code: '976' }],
  },
  {
    name: 'Saint-Pierre-et-Miquelon',
    departements: [{ name: 'Saint-Pierre-et-Miquelon', code: '975' }],
  },
  {
    name: 'Polynésie Française',
    departements: [{ name: 'Polynésie Française', code: '987' }],
  },
  {
    name: 'Nouvelle-Calédonie',
    departements: [{ name: 'Nouvelle-Calédonie', code: '988' }],
  },
  {
    name: 'Wallis-et-Futuna',
    departements: [{ name: 'Wallis-et-Futuna', code: '986' }],
  },
  {
    name: 'Terres australes et antarctiques françaises',
    departements: [
      { name: 'Terres australes et antarctiques françaises', code: '984' },
    ],
  },
  {
    name: 'Saint-Barthélemy',
    departements: [{ name: 'Saint-Barthélemy', code: '977' }],
  },
  {
    name: 'Saint-Martin',
    departements: [{ name: 'Saint-Martin', code: '978' }],
  },
];

@Injectable()
export class RegionsDepartementsSeed {
  constructor(
    private readonly saveRegionUsecase: SaveRegionUsecase,
    private readonly saveDepartementUsecase: SaveDepartementUsecase,
  ) {}

  async seed() {
    let regionsCount = 0;
    let departementsCount = 0;

    const promises: Promise<DepartementEntity>[] = [];

    for (const region of regions) {
      const newRegion = await this.saveRegionUsecase.execute(
        new RegionEntity(region.name, []),
      );

      regionsCount = regionsCount + 1;

      for (const departement of region.departements) {
        await this.saveDepartementUsecase.execute(
          new DepartementEntity(departement.name, departement.code, newRegion),
        );

        departementsCount = departementsCount + 1;
      }
    }

    await Promise.all(promises);

    console.log(`${regionsCount} regions créées.`);
    console.log(`${departementsCount} départements créés.`);
  }
}
