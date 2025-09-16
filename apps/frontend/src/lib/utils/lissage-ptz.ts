export type Zone = 'A' | 'Abis' | 'B1' | 'B2' | 'C';
export type Logement = 'collectif' | 'individuel';
type Plafond = { zone: Zone; plafonds: number[] };

const plafondsRevenus: Plafond[] = [
  {
    zone: 'A',
    plafonds: [49000, 73500, 88200, 102900, 117600, 132300, 147000, 161700],
  },
  {
    zone: 'Abis',
    plafonds: [49000, 73500, 88200, 102900, 117600, 132300, 147000, 161700],
  },
  {
    zone: 'B1',
    plafonds: [34500, 51750, 62100, 72450, 82800, 93150, 103500, 113850],
  },
  {
    zone: 'B2',
    plafonds: [31500, 47250, 56700, 66150, 75600, 85050, 94500, 103950],
  },
  {
    zone: 'C',
    plafonds: [28500, 42750, 51300, 59850, 68400, 76950, 85500, 94050],
  },
];

// const plafondsQuotités: Plafond[] = [
//   {
//     zone: 'A',
//     plafonds: [25000, 31000, 37000, 49000],
//   },
//   {
//     zone: 'Abis',
//     plafonds: [25000, 31000, 37000, 49000],
//   },
//   {
//     zone: 'B1',
//     plafonds: [21500, 26000, 30000, 34500],
//   },
//   {
//     zone: 'B2',
//     plafonds: [18000, 22500, 27000, 31500],
//   },
//   {
//     zone: 'C',
//     plafonds: [15500, 19500, 24000, 28500],
//   },
// ];

// const tranches: {
//   numero: number;
//   tauxCollectif: number;
//   tauxIndividuel: number;
//   anneesDifferees: number;
//   dureeRemboursement: number;
// }[] = [
//   {
//     numero: 1,
//     tauxCollectif: 50,
//     tauxIndividuel: 30,
//     anneesDifferees: 10,
//     dureeRemboursement: 15,
//   },
//   {
//     numero: 2,
//     tauxCollectif: 40,
//     tauxIndividuel: 20,
//     anneesDifferees: 8,
//     dureeRemboursement: 12,
//   },
//   {
//     numero: 3,
//     tauxCollectif: 40,
//     tauxIndividuel: 20,
//     anneesDifferees: 2,
//     dureeRemboursement: 13,
//   },
//   {
//     numero: 3,
//     tauxCollectif: 20,
//     tauxIndividuel: 10,
//     anneesDifferees: 0,
//     dureeRemboursement: 10,
//   },
// ];

// const quotientsFamilial: number[] = [1, 0, 1.5, 1.8, 2.1, 2.4, 2.7, 3.8, 4];

// const plafondsPTZ: Plafond[] = [
//   {
//     zone: 'A',
//     plafonds: [150000, 225000, 270000, 315000, 360000],
//   },
//   {
//     zone: 'Abis',
//     plafonds: [150000, 225000, 270000, 315000, 360000],
//   },
//   {
//     zone: 'B1',
//     plafonds: [135000, 202500, 243000, 283500, 324000],
//   },
//   {
//     zone: 'B2',
//     plafonds: [110000, 165000, 198000, 231000, 264000],
//   },
//   {
//     zone: 'C',
//     plafonds: [100000, 150000, 180000, 210000, 240000],
//   },
// ];

export class PretLisse {
  public montantEmprunt: number;
  public zone: Zone;
  public apport: number;
  public tauxEmprunt: number;
  public dureeEmprunt: number;
  public nbPersonnes: number;
  public revenuFiscalReference: number;
  public typeLogement: Logement;

  constructor(
    montantEmprunt: number,
    zone: Zone,
    apport: number,
    tauxEmprunt: number,
    dureeEmprunt: number,
    nbPersonnes: number,
    revenuFiscalReference: number,
    typeLogement: Logement,
  ) {
    this.montantEmprunt = montantEmprunt;
    this.zone = zone;
    this.apport = apport;
    this.tauxEmprunt = tauxEmprunt;
    this.dureeEmprunt = dureeEmprunt;
    this.nbPersonnes = nbPersonnes;
    this.revenuFiscalReference = revenuFiscalReference;
    this.typeLogement = typeLogement;
  }

  public estElligible(): boolean {
    const zone = plafondsRevenus.find(
      (plafondRevenu) => plafondRevenu.zone === this.zone,
    ) as Plafond;

    const index = Math.min(this.nbPersonnes, zone.plafonds.length) - 1;
    const plafond = zone?.plafonds[index];

    return this.revenuFiscalReference <= plafond;
  }
}
