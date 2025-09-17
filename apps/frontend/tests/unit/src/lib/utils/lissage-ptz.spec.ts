import {
  PretLisse,
  tranches,
  type Logement,
  type Zone,
} from '$lib/utils/lissage-ptz';
import { describe, it, expect } from 'vitest';

const montantEmprunt = 0;
const zone: Zone = 'A';
const apport = 0;
const tauxEmprunt = 0;
const dureeEmprunt = 0;
const nbPersonnes = 1;
const revenuFiscalReference = 24000;
const typeLogement: Logement = 'collectif';

const pretLisseInitial = () =>
  new PretLisse(
    montantEmprunt,
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

    expect(pretLisse.estElligible()).toBe(true);

    pretLisse.zone = 'Abis';
    pretLisse.nbPersonnes = 7;
    pretLisse.revenuFiscalReference = 140000;
    expect(pretLisse.estElligible()).toBe(true);

    pretLisse.zone = 'B1';
    pretLisse.revenuFiscalReference = 90000;
    expect(pretLisse.estElligible()).toBe(true);

    pretLisse.zone = 'B2';
    pretLisse.nbPersonnes = 12;
    pretLisse.revenuFiscalReference = 100000;
    expect(pretLisse.estElligible()).toBe(true);

    pretLisse.zone = 'C';
    pretLisse.nbPersonnes = 5;
    pretLisse.revenuFiscalReference = 68000;
    expect(pretLisse.estElligible()).toBe(true);
  });

  it('ne devrait pas être elligible', () => {
    const pretLisse = pretLisseInitial();

    pretLisse.zone = 'Abis';
    pretLisse.nbPersonnes = 7;
    pretLisse.revenuFiscalReference = 150000;
    expect(pretLisse.estElligible()).toBe(false);

    pretLisse.zone = 'B1';
    pretLisse.nbPersonnes = 3;
    pretLisse.revenuFiscalReference = 70000;
    expect(pretLisse.estElligible()).toBe(false);

    pretLisse.zone = 'B2';
    pretLisse.nbPersonnes = 12;
    pretLisse.revenuFiscalReference = 200000;
    expect(pretLisse.estElligible()).toBe(false);

    pretLisse.zone = 'C';
    pretLisse.nbPersonnes = 5;
    pretLisse.revenuFiscalReference = 70000;
    expect(pretLisse.estElligible()).toBe(false);
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
    expect(pretLisse.calculerMontantPTZ()).toBe(157500);

    pretLisse.nbPersonnes = 6;
    pretLisse.revenuFiscalReference = 110000;
    expect(pretLisse.calculerMontantPTZ()).toBe(72000);

    pretLisse.typeLogement = 'individuel';
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
});
