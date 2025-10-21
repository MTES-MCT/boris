import {
  PretLisse,
  tranches,
  type Logement,
  type Zone,
} from '$lib/utils/lissage-ptz';
import { describe, it, expect } from 'vitest';

const montantTotalOperation = 200000;
const zone: Zone = 'A';
const apport = 5000;
const tauxEmprunt = 4;
const dureeEmprunt = 25;
const nbPersonnes = 1;
const revenuFiscalReference = 24000;
const typeLogement: Logement = 'collectif';

const pretLisseInitial = () =>
  new PretLisse(
    montantTotalOperation,
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
    let pretLisse = pretLisseInitial();
    expect(pretLisse.estElligible).toBe(true);

    pretLisse = new PretLisse(
      200000,
      'Abis',
      5000,
      4,
      25,
      7,
      140000,
      'collectif',
    );
    expect(pretLisse.estElligible).toBe(true);

    pretLisse = new PretLisse(200000, 'B1', 5000, 4, 25, 7, 90000, 'collectif');
    expect(pretLisse.estElligible).toBe(true);

    pretLisse = new PretLisse(
      200000,
      'B2',
      5000,
      4,
      25,
      12,
      100000,
      'collectif',
    );
    expect(pretLisse.estElligible).toBe(true);

    pretLisse = new PretLisse(200000, 'C', 5000, 4, 25, 5, 68000, 'collectif');
    expect(pretLisse.estElligible).toBe(true);
  });

  it('ne devrait pas être elligible', () => {
    let pretLisse = new PretLisse(
      200000,
      'Abis',
      5000,
      4,
      25,
      7,
      150000,
      'collectif',
    );
    expect(pretLisse.estElligible).toBe(false);

    pretLisse = new PretLisse(
      200000,
      'B1',
      5000,
      4,
      25,
      7,
      150000,
      'collectif',
    );
    expect(pretLisse.estElligible).toBe(false);

    pretLisse = new PretLisse(
      200000,
      'B2',
      5000,
      4,
      25,
      12,
      200000,
      'collectif',
    );
    expect(pretLisse.estElligible).toBe(false);

    pretLisse = new PretLisse(200000, 'C', 5000, 4, 25, 5, 70000, 'collectif');
    expect(pretLisse.estElligible).toBe(false);
  });

  it('devrait trouver la bonne tranche', () => {
    let pretLisse = pretLisseInitial();
    expect(pretLisse.tranche).toStrictEqual(tranches[0]);

    pretLisse = new PretLisse(
      200000,
      'Abis',
      5000,
      4,
      25,
      4,
      46000,
      'collectif',
    );
    expect(pretLisse.tranche).toStrictEqual(tranches[0]);

    pretLisse = new PretLisse(
      200000,
      'Abis',
      5000,
      4,
      25,
      6,
      110000,
      'collectif',
    );
    expect(pretLisse.tranche).toStrictEqual(tranches[3]);

    pretLisse = new PretLisse(200000, 'B1', 5000, 4, 25, 3, 53000, 'collectif');
    expect(pretLisse.tranche).toStrictEqual(tranches[2]);

    pretLisse = new PretLisse(200000, 'B2', 5000, 4, 25, 4, 42000, 'collectif');
    expect(pretLisse.tranche).toStrictEqual(tranches[1]);

    pretLisse = new PretLisse(200000, 'C', 5000, 4, 25, 2, 30000, 'collectif');
    expect(pretLisse.tranche).toStrictEqual(tranches[2]);
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
    let pretLisse = pretLisseInitial();
    expect(pretLisse.montantPTZ).toBe(75000);

    pretLisse = new PretLisse(
      200000,
      'Abis',
      5000,
      4,
      25,
      4,
      46000,
      'collectif',
    );
    expect(pretLisse.montantPTZ).toBe(97500);

    pretLisse.nbPersonnes = 6;
    pretLisse.revenuFiscalReference = 110000;
    pretLisse = new PretLisse(
      200000,
      'Abis',
      5000,
      4,
      25,
      6,
      110000,
      'collectif',
    );
    expect(pretLisse.montantPTZ).toBe(39000);

    pretLisse = new PretLisse(
      400000,
      'Abis',
      5000,
      4,
      25,
      6,
      110000,
      'individuel',
    );
    expect(pretLisse.montantPTZ).toBe(36000);

    pretLisse = new PretLisse(
      200000,
      'Abis',
      5000,
      4,
      25,
      4,
      46000,
      'individuel',
    );
    expect(pretLisse.montantPTZ).toBe(58500);

    pretLisse = new PretLisse(
      200000,
      'B1',
      5000,
      4,
      25,
      4,
      46000,
      'individuel',
    );

    expect(pretLisse.montantPTZ).toBe(39000);

    pretLisse = new PretLisse(
      200000,
      'B1',
      5000,
      4,
      25,
      3,
      53000,
      'individuel',
    );
    expect(pretLisse.montantPTZ).toBe(39000);

    pretLisse = new PretLisse(200000, 'B1', 5000, 4, 25, 4, 46000, 'collectif');
    expect(pretLisse.montantPTZ).toBe(78000);

    pretLisse = new PretLisse(200000, 'B2', 5000, 4, 25, 4, 42000, 'collectif');
    expect(pretLisse.montantPTZ).toBe(78000);

    pretLisse = new PretLisse(200000, 'C', 5000, 4, 25, 2, 30000, 'collectif');
    expect(pretLisse.montantPTZ).toBe(60000);
  });

  it('devrait lisser le prêt classique et le PTZ', () => {
    let pretLisse = pretLisseInitial();
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(
      300000,
      'B2',
      20000,
      3,
      25,
      3,
      35000,
      'individuel',
    );
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(
      300000,
      'B2',
      20000,
      3,
      25,
      3,
      35000,
      'collectif',
    );
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(300000, 'C', 20000, 2, 25, 2, 30000, 'collectif');
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(
      500000,
      'Abis',
      100000,
      2.5,
      25,
      6,
      110000,
      'collectif',
    );
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(
      500000,
      'Abis',
      100000,
      2.5,
      15,
      6,
      110000,
      'collectif',
    );
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(
      500000,
      'Abis',
      100000,
      2.5,
      10,
      6,
      110000,
      'collectif',
    );
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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
    pretLisse.montantTotalOperation = 300000;
    pretLisse.apport = 20000;
    pretLisse = new PretLisse(
      300000,
      'B2',
      20000,
      3,
      15,
      3,
      35000,
      'individuel',
    );
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(
      300000,
      'B2',
      20000,
      3,
      10,
      3,
      35000,
      'individuel',
    );
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(200000, 'A', 5000, 4, 8, 1, 24000, 'collectif');
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(20460, 'A', 10000, 3, 25, 2, 44000, 'collectif');
    expect(pretLisse.phasesRemboursement).toStrictEqual([
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

    pretLisse = new PretLisse(75000, 'B1', 40000, 3, 25, 2, 24000, 'collectif');
    expect(pretLisse.phasesRemboursement).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 10,
        mensualitePTZ: '0.00',
        mensualiteClassique: '132.46',
      },
      {
        anneesDifferees: 10,
        dureeAnnees: 15,
        mensualitePTZ: '97.22',
        mensualiteClassique: '35.24',
      },
    ]);

    pretLisse = new PretLisse(75000, 'B1', 40000, 3, 20, 1, 15000, 'collectif');
    expect(pretLisse.phasesRemboursement).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 10,
        mensualitePTZ: '0.00',
        mensualiteClassique: '138.44',
      },
      {
        anneesDifferees: 10,
        dureeAnnees: 10,
        mensualitePTZ: '97.22',
        mensualiteClassique: '41.22',
      },
      {
        anneesDifferees: 20,
        dureeAnnees: 5,
        mensualiteClassique: '0.00',
        mensualitePTZ: '97.22',
      },
    ]);

    pretLisse = new PretLisse(270000, 'A', 11000, 3, 25, 2, 50000, 'collectif');
    expect(pretLisse.phasesRemboursement).toStrictEqual([
      {
        anneesDifferees: 0,
        dureeAnnees: 2,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1133.93',
      },
      {
        anneesDifferees: 2,
        dureeAnnees: 13,
        mensualitePTZ: '576.92',
        mensualiteClassique: '557.01',
      },
      {
        anneesDifferees: 15,
        dureeAnnees: 10,
        mensualitePTZ: '0.00',
        mensualiteClassique: '1133.93',
      },
    ]);
  });

  it('devrait calculer le coût des intérêts du prêt immobilier classique', () => {
    const pretLisse = pretLisseInitial();
    expect(pretLisse.calculateInterestCost()).toBe(70021.26);
  });
});
