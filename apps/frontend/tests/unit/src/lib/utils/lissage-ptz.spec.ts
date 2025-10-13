import {
  PretLisse,
  tranches,
  type Logement,
  type Zone,
} from '$lib/utils/lissage-ptz';
import { describe, it, expect } from 'vitest';

const montantTotal = 200000;
const zone: Zone = 'A';
const apport = 5000;
const tauxEmprunt = 4;
const dureeEmprunt = 25;
const nbPersonnes = 1;
const revenuFiscalReference = 24000;
const typeLogement: Logement = 'collectif';

const pretLisseInitial = () =>
  new PretLisse(
    montantTotal,
    zone,
    apport,
    tauxEmprunt,
    dureeEmprunt,
    nbPersonnes,
    revenuFiscalReference,
    typeLogement,
  );

describe('PrêtLissé', () => {
  it('devrait être elligible', () => {
    const pretLisse = pretLisseInitial();
    expect(pretLisse.definirEstElligible()).toBe(true);

    pretLisse.zone = 'Abis';
    pretLisse.nbPersonnes = 7;
    pretLisse.revenuFiscalReference = 140000;
    expect(pretLisse.definirEstElligible()).toBe(true);

    pretLisse.zone = 'B1';
    pretLisse.revenuFiscalReference = 90000;
    expect(pretLisse.definirEstElligible()).toBe(true);

    pretLisse.zone = 'B2';
    pretLisse.nbPersonnes = 12;
    pretLisse.revenuFiscalReference = 100000;
    expect(pretLisse.definirEstElligible()).toBe(true);

    pretLisse.zone = 'C';
    pretLisse.nbPersonnes = 5;
    pretLisse.revenuFiscalReference = 68000;
    expect(pretLisse.definirEstElligible()).toBe(true);
  });

  it('ne devrait pas être elligible', () => {
    const pretLisse = pretLisseInitial();

    pretLisse.zone = 'Abis';
    pretLisse.nbPersonnes = 7;
    pretLisse.revenuFiscalReference = 150000;
    expect(pretLisse.definirEstElligible()).toBe(false);

    pretLisse.zone = 'B1';
    pretLisse.nbPersonnes = 3;
    pretLisse.revenuFiscalReference = 70000;
    expect(pretLisse.definirEstElligible()).toBe(false);

    pretLisse.zone = 'B2';
    pretLisse.nbPersonnes = 12;
    pretLisse.revenuFiscalReference = 200000;
    expect(pretLisse.definirEstElligible()).toBe(false);

    pretLisse.zone = 'C';
    pretLisse.nbPersonnes = 5;
    pretLisse.revenuFiscalReference = 70000;
    expect(pretLisse.definirEstElligible()).toBe(false);
  });

  it('devrait trouver la bonne tranche', () => {
    const pretLisse = pretLisseInitial();
    expect(pretLisse.trouverTranche()).toBe(tranches[0]);

    pretLisse.zone = 'Abis';
    pretLisse.nbPersonnes = 4;
    pretLisse.revenuFiscalReference = 46000;
    expect(pretLisse.trouverTranche()).toBe(tranches[0]);

    pretLisse.nbPersonnes = 6;
    pretLisse.revenuFiscalReference = 110000;
    expect(pretLisse.trouverTranche()).toBe(tranches[3]);

    pretLisse.zone = 'B1';
    pretLisse.nbPersonnes = 3;
    pretLisse.revenuFiscalReference = 53000;
    expect(pretLisse.trouverTranche()).toBe(tranches[2]);

    pretLisse.zone = 'B2';
    pretLisse.nbPersonnes = 4;
    pretLisse.revenuFiscalReference = 42000;
    expect(pretLisse.trouverTranche()).toBe(tranches[1]);

    pretLisse.zone = 'C';
    pretLisse.nbPersonnes = 2;
    pretLisse.revenuFiscalReference = 30000;
    expect(pretLisse.trouverTranche()).toBe(tranches[2]);
  });

  it('devrait trouver le plafond PTZ', () => {
    const pretLisse = pretLisseInitial();

    expect(pretLisse.trouverPlafondPTZ()).toBe(150000);

    pretLisse.nbPersonnes = 3;
    expect(pretLisse.trouverPlafondPTZ()).toBe(270000);

    pretLisse.zone = 'Abis';
    pretLisse.nbPersonnes = 2;
    expect(pretLisse.trouverPlafondPTZ()).toBe(225000);

    pretLisse.zone = 'B1';
    pretLisse.nbPersonnes = 1;
    expect(pretLisse.trouverPlafondPTZ()).toBe(135000);

    pretLisse.nbPersonnes = 8;
    expect(pretLisse.trouverPlafondPTZ()).toBe(324000);

    pretLisse.zone = 'B2';
    pretLisse.nbPersonnes = 3;
    expect(pretLisse.trouverPlafondPTZ()).toBe(198000);

    pretLisse.zone = 'C';
    pretLisse.nbPersonnes = 5;
    expect(pretLisse.trouverPlafondPTZ()).toBe(240000);
  });

  it('devrait calculer le montant du PTZ', () => {
    const pretLisse = pretLisseInitial();
    expect(pretLisse.calculerMontantPTZ()).toBe(75000);

    pretLisse.zone = 'Abis';
    pretLisse.nbPersonnes = 4;
    pretLisse.revenuFiscalReference = 46000;
    expect(pretLisse.calculerMontantPTZ()).toBe(97500);

    pretLisse.nbPersonnes = 6;
    pretLisse.revenuFiscalReference = 110000;
    expect(pretLisse.calculerMontantPTZ()).toBe(39000);

    pretLisse.typeLogement = 'individuel';
    pretLisse.montantTotal = 400000;
    expect(pretLisse.calculerMontantPTZ()).toBe(36000);

    pretLisse.nbPersonnes = 4;
    pretLisse.revenuFiscalReference = 46000;
    expect(pretLisse.calculerMontantPTZ()).toBe(94500);

    pretLisse.zone = 'B1';
    expect(pretLisse.calculerMontantPTZ()).toBe(56700);

    pretLisse.nbPersonnes = 3;
    pretLisse.revenuFiscalReference = 53000;
    expect(pretLisse.calculerMontantPTZ()).toBe(48600);

    pretLisse.typeLogement = 'collectif';
    expect(pretLisse.calculerMontantPTZ()).toBe(97200);

    pretLisse.zone = 'B2';
    pretLisse.nbPersonnes = 4;
    pretLisse.revenuFiscalReference = 42000;
    expect(pretLisse.calculerMontantPTZ()).toBe(92400);

    pretLisse.zone = 'C';
    pretLisse.nbPersonnes = 2;
    pretLisse.revenuFiscalReference = 30000;
    expect(pretLisse.calculerMontantPTZ()).toBe(60000);
  });

  it('devrait lisser le prêt classique et le PTZ', () => {
    const pretLisse = pretLisseInitial();
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 10,
        mensualitePTZ: '0.00',
        mensualiteClassique: '832.85',
      },
      {
        anneesDifferees: 10,
        dureeAnnees: 15,
        mensualitePTZ: '416.67',
        mensualiteClassique: '416.18',
      },
    ]);

    pretLisse.dureeEmprunt = 25;
    pretLisse.tauxEmprunt = 3;
    pretLisse.typeLogement = 'individuel';
    pretLisse.nbPersonnes = 3;
    pretLisse.revenuFiscalReference = 35000;
    pretLisse.zone = 'B2';
    pretLisse.montantTotal = 300000;
    pretLisse.apport = 20000;
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 8,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1263.97',
      },
      {
        anneesDifferees: 8,
        dureeAnnees: 12,
        mensualitePTZ: '275.00',
        mensualiteClassique: '988.97',
      },
      {
        anneesDifferees: 20,
        dureeAnnees: 5,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1263.97',
      },
    ]);

    pretLisse.dureeEmprunt = 25;
    pretLisse.tauxEmprunt = 3;
    pretLisse.typeLogement = 'collectif';
    pretLisse.nbPersonnes = 3;
    pretLisse.revenuFiscalReference = 35000;
    pretLisse.zone = 'B2';
    pretLisse.montantTotal = 300000;
    pretLisse.apport = 20000;
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 8,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1200.14',
      },
      {
        anneesDifferees: 8,
        dureeAnnees: 12,
        mensualitePTZ: '550.00',
        mensualiteClassique: '650.14',
      },
      {
        anneesDifferees: 20,
        dureeAnnees: 5,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1200.14',
      },
    ]);

    pretLisse.dureeEmprunt = 25;
    pretLisse.tauxEmprunt = 2;
    pretLisse.typeLogement = 'collectif';
    pretLisse.nbPersonnes = 2;
    pretLisse.revenuFiscalReference = 30000;
    pretLisse.zone = 'C';
    pretLisse.montantTotal = 300000;
    pretLisse.apport = 20000;
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 2,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1147.49',
      },
      {
        anneesDifferees: 2,
        dureeAnnees: 13,
        mensualitePTZ: '384.62',
        mensualiteClassique: '762.87',
      },
      {
        anneesDifferees: 15,
        dureeAnnees: 10,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1147.49',
      },
    ]);

    pretLisse.dureeEmprunt = 25;
    pretLisse.tauxEmprunt = 2.5;
    pretLisse.typeLogement = 'collectif';
    pretLisse.nbPersonnes = 6;
    pretLisse.revenuFiscalReference = 110000;
    pretLisse.zone = 'Abis';
    pretLisse.montantTotal = 500000;
    pretLisse.apport = 100000;
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 10,
        mensualitePTZ: '600.00',
        mensualiteClassique: '1156.99',
      },
      {
        anneesDifferees: 10,
        dureeAnnees: 15,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1756.99',
      },
    ]);

    pretLisse.dureeEmprunt = 15;
    pretLisse.tauxEmprunt = 2.5;
    pretLisse.typeLogement = 'collectif';
    pretLisse.nbPersonnes = 6;
    pretLisse.revenuFiscalReference = 110000;
    pretLisse.zone = 'Abis';
    pretLisse.montantTotal = 500000;
    pretLisse.apport = 100000;
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 10,
        mensualitePTZ: '600.00',
        mensualiteClassique: '2011.46',
      },
      {
        anneesDifferees: 10,
        dureeAnnees: 5,
        mensualitePTZ: '0.00',
        mensualiteClassique: '2611.46',
      },
    ]);

    pretLisse.dureeEmprunt = 10;
    pretLisse.tauxEmprunt = 2.5;
    pretLisse.typeLogement = 'collectif';
    pretLisse.nbPersonnes = 6;
    pretLisse.revenuFiscalReference = 110000;
    pretLisse.zone = 'Abis';
    pretLisse.montantTotal = 500000;
    pretLisse.apport = 100000;
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 10,
        mensualitePTZ: '600.00',
        mensualiteClassique: '3092.05',
      },
    ]);

    pretLisse.dureeEmprunt = 15;
    pretLisse.tauxEmprunt = 3;
    pretLisse.typeLogement = 'individuel';
    pretLisse.nbPersonnes = 3;
    pretLisse.revenuFiscalReference = 35000;
    pretLisse.zone = 'B2';
    pretLisse.montantTotal = 300000;
    pretLisse.apport = 20000;
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 8,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1773.25',
      },
      {
        anneesDifferees: 8,
        dureeAnnees: 7,
        mensualitePTZ: '275.00',
        mensualiteClassique: '1498.25',
      },
      {
        anneesDifferees: 15,
        dureeAnnees: 5,
        mensualitePTZ: '275.00',
        mensualiteClassique: '0.00',
      },
    ]);

    pretLisse.dureeEmprunt = 10;
    pretLisse.tauxEmprunt = 3;
    pretLisse.typeLogement = 'individuel';
    pretLisse.nbPersonnes = 3;
    pretLisse.revenuFiscalReference = 35000;
    pretLisse.zone = 'B2';
    pretLisse.montantTotal = 300000;
    pretLisse.apport = 20000;
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 8,
        mensualitePTZ: '0.00',
        mensualiteClassique: '2369.93',
      },
      {
        anneesDifferees: 8,
        dureeAnnees: 2,
        mensualitePTZ: '275.00',
        mensualiteClassique: '2094.93',
      },
      {
        anneesDifferees: 10,
        dureeAnnees: 10,
        mensualitePTZ: '275.00',
        mensualiteClassique: '0.00',
      },
    ]);

    pretLisse.dureeEmprunt = 8;
    pretLisse.tauxEmprunt = 4;
    pretLisse.typeLogement = 'collectif';
    pretLisse.nbPersonnes = 1;
    pretLisse.revenuFiscalReference = 24000;
    pretLisse.zone = 'A';
    pretLisse.montantTotal = 200000;
    pretLisse.apport = 5000;
    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 8,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1462.71',
      },
      {
        anneesDifferees: 10,
        dureeAnnees: 15,
        mensualitePTZ: '416.67',
        mensualiteClassique: '0.00',
      },
    ]);

    pretLisse.dureeEmprunt = 25;
    pretLisse.tauxEmprunt = 3;
    pretLisse.typeLogement = 'collectif';
    pretLisse.nbPersonnes = 2;
    pretLisse.revenuFiscalReference = 44000;
    pretLisse.zone = 'A';
    pretLisse.montantTotal = 20460;
    pretLisse.apport = 10000;

    console.log(pretLisse.lisser());

    expect(pretLisse.lisser()).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 8,
        mensualitePTZ: '0.00',
        mensualiteClassique: '42.86',
      },
      {
        anneesDifferees: 8,
        dureeAnnees: 12,
        mensualitePTZ: '29.06',
        mensualiteClassique: '13.80',
      },
      {
        anneesDifferees: 20,
        dureeAnnees: 5,
        mensualitePTZ: '0.00',
        mensualiteClassique: '42.86',
      },
    ]);
  });

  it('devrait calculer le coût des intérêts du prêt immobilier classique', () => {
    const pretLisse = pretLisseInitial();

    expect(pretLisse.calculateInterestCost()).toBe(70021.26);
  });
});
