export type Zone = 'A' | 'Abis' | 'B1' | 'B2' | 'C';
export type Logement = 'collectif' | 'individuel';
type PlafondsLocalise = { zone: Zone; montants: number[] };
type Tranche = {
  numero: number;
  tauxCollectif: number;
  tauxIndividuel: number;
  anneesDifferees: number;
  dureeRemboursement: number;
};
type PhaseRemboursement = {
  dureeAnnees: number;
  anneesDifferees: number;
  mensualitePTZ: string;
  mensualiteClassique: string;
};

const plafondsRevenus: PlafondsLocalise[] = [
  {
    zone: 'A',
    montants: [49000, 73500, 88200, 102900, 117600, 132300, 147000, 161700],
  },
  {
    zone: 'Abis',
    montants: [49000, 73500, 88200, 102900, 117600, 132300, 147000, 161700],
  },
  {
    zone: 'B1',
    montants: [34500, 51750, 62100, 72450, 82800, 93150, 103500, 113850],
  },
  {
    zone: 'B2',
    montants: [31500, 47250, 56700, 66150, 75600, 85050, 94500, 103950],
  },
  {
    zone: 'C',
    montants: [28500, 42750, 51300, 59850, 68400, 76950, 85500, 94050],
  },
];

const plafondsTranches: PlafondsLocalise[] = [
  {
    zone: 'A',
    montants: [25000, 31000, 37000, 49000],
  },
  {
    zone: 'Abis',
    montants: [25000, 31000, 37000, 49000],
  },
  {
    zone: 'B1',
    montants: [21500, 26000, 30000, 34500],
  },
  {
    zone: 'B2',
    montants: [18000, 22500, 27000, 31500],
  },
  {
    zone: 'C',
    montants: [15500, 19500, 24000, 28500],
  },
];

export const tranches: Tranche[] = [
  {
    numero: 1,
    tauxCollectif: 50,
    tauxIndividuel: 30,
    anneesDifferees: 10,
    dureeRemboursement: 15,
  },
  {
    numero: 2,
    tauxCollectif: 40,
    tauxIndividuel: 20,
    anneesDifferees: 8,
    dureeRemboursement: 12,
  },
  {
    numero: 3,
    tauxCollectif: 40,
    tauxIndividuel: 20,
    anneesDifferees: 2,
    dureeRemboursement: 13,
  },
  {
    numero: 4,
    tauxCollectif: 20,
    tauxIndividuel: 10,
    anneesDifferees: 0,
    dureeRemboursement: 10,
  },
];

const quotientsFamilial: number[] = [1, 1.5, 1.8, 2.1, 2.4, 2.7, 3.8, 4];

const plafondsPTZ: PlafondsLocalise[] = [
  {
    zone: 'A',
    montants: [150000, 225000, 270000, 315000, 360000],
  },
  {
    zone: 'Abis',
    montants: [150000, 225000, 270000, 315000, 360000],
  },
  {
    zone: 'B1',
    montants: [135000, 202500, 243000, 283500, 324000],
  },
  {
    zone: 'B2',
    montants: [110000, 165000, 198000, 231000, 264000],
  },
  {
    zone: 'C',
    montants: [100000, 150000, 180000, 210000, 240000],
  },
];

export class PretLisse {
  public montantTotal: number;
  public zone: Zone;
  public apport: number;
  public tauxEmprunt: number;
  public dureeEmprunt: number;
  public nbPersonnes: number;
  public revenuFiscalReference: number;
  public typeLogement: Logement;
  public tranche?: Tranche;
  public montantPTZ?: number;
  public estElligible: boolean;

  constructor(
    montantTotal: number,
    zone: Zone,
    apport: number,
    tauxEmprunt: number,
    dureeEmprunt: number,
    nbPersonnes: number,
    revenuFiscalReference: number,
    typeLogement: Logement,
  ) {
    this.montantTotal = montantTotal;
    this.zone = zone;
    this.apport = apport;
    this.tauxEmprunt = tauxEmprunt;
    this.dureeEmprunt = dureeEmprunt;
    this.nbPersonnes = nbPersonnes;
    this.revenuFiscalReference = revenuFiscalReference;
    this.typeLogement = typeLogement;

    this.estElligible = this.definirEstElligible();

    if (this.estElligible) {
      this.tranche = this.trouverTranche();
      this.montantPTZ = this.calculerMontantPTZ();
    }
  }

  public definirEstElligible(): boolean {
    const plafondsRevenusLocalises = plafondsRevenus.find(
      (item) => item.zone === this.zone,
    ) as PlafondsLocalise;

    const index =
      Math.min(this.nbPersonnes, plafondsRevenusLocalises.montants.length) - 1;
    const plafond = plafondsRevenusLocalises?.montants[index];

    return this.revenuFiscalReference <= plafond;
  }

  // Source: https://www.anil.org/pret-taux-zero/
  // L'appartenance de l’emprunteur à l’une de ces tranches est déterminée en fonction du montant total des ressources des personnes destinées à occuper le logement divisé par un coefficient familial.
  public trouverTranche(): Tranche {
    const plafondsTranchesLocalises = plafondsTranches.find(
      (item) => item.zone === this.zone,
    ) as PlafondsLocalise;

    const quotientFamilial =
      quotientsFamilial[
        Math.min(this.nbPersonnes, quotientsFamilial.length) - 1
      ];
    const critere = this.revenuFiscalReference / quotientFamilial;

    const index = plafondsTranchesLocalises.montants.findIndex((montant, i) => {
      if (i === 0 && critere <= montant) {
        return true;
      } else {
        const borneInferieure = plafondsTranchesLocalises.montants[i - 1];
        return borneInferieure < critere && critere <= montant;
      }
    });

    this.tranche = tranches.find(
      (tranche) => tranche.numero === index + 1,
    ) as Tranche;
    return this.tranche;
  }

  public trouverPlafondPTZ(): number {
    const plafondsPTZLocalises = plafondsPTZ.find(
      (item) => item.zone === this.zone,
    ) as PlafondsLocalise;

    const index =
      Math.min(this.nbPersonnes, plafondsPTZLocalises.montants.length) - 1;
    const plafond = plafondsPTZLocalises?.montants[index];

    return plafond;
  }

  public calculerMontantPTZ(): number {
    const tranche = this.trouverTranche();
    const plafondPTZ = this.trouverPlafondPTZ();
    const quotite =
      this.typeLogement === 'collectif'
        ? tranche.tauxCollectif
        : tranche.tauxIndividuel;

    this.montantPTZ = Math.min(plafondPTZ, this.montantTotal) * (quotite / 100);
    return this.montantPTZ;
  }

  private rho(t: number, D: number) {
    return t / (1 - Math.pow(1 + t, -D));
  }

  public lisser() {
    this.tranche = this.trouverTranche();
    this.montantPTZ = this.calculerMontantPTZ();

    const tauxMensuel = this.tauxEmprunt / 100 / 12;
    const dureeRemboursementPTZMois = this.tranche.dureeRemboursement * 12;
    const montantPretClassique =
      this.montantTotal - this.montantPTZ - this.apport;
    const dureeEmpruntMois = this.dureeEmprunt * 12;
    const differePTZMois = this.tranche.anneesDifferees * 12;

    const mensualitePTZ = (this.montantPTZ / dureeRemboursementPTZMois).toFixed(
      2,
    );

    // source: https://res.cloudinary.com/pretto-fr/image/upload/q_auto,f_webp,w_1240/website/content/formule-lissage-pret
    const somme =
      Number(mensualitePTZ) /
      (this.rho(tauxMensuel, dureeRemboursementPTZMois) *
        Math.pow(1 + tauxMensuel, differePTZMois));

    const mensualiteTotale = (
      (montantPretClassique + somme) *
      this.rho(tauxMensuel, dureeEmpruntMois)
    ).toFixed(2);

    const phasesRemboursement: PhaseRemboursement[] = [];

    if (differePTZMois > 0) {
      phasesRemboursement.push({
        anneesDifferees: 0,
        dureeAnnees: Number((differePTZMois / 12).toFixed(2)),
        mensualitePTZ: '0.00',
        mensualiteClassique: mensualiteTotale,
      });
    }

    phasesRemboursement.push({
      anneesDifferees: this.tranche.anneesDifferees,
      dureeAnnees: this.tranche.dureeRemboursement,
      mensualitePTZ: mensualitePTZ,
      mensualiteClassique: (
        Number(mensualiteTotale) - Number(mensualitePTZ)
      ).toFixed(2),
    });

    const dureeRestante =
      dureeEmpruntMois - (differePTZMois + dureeRemboursementPTZMois);
    if (dureeRestante > 0) {
      phasesRemboursement.push({
        anneesDifferees:
          this.tranche.anneesDifferees + this.tranche.dureeRemboursement,
        dureeAnnees: dureeRestante / 12,
        mensualitePTZ: '0.00',
        mensualiteClassique: mensualiteTotale,
      });
    }

    return phasesRemboursement;
  }
}
