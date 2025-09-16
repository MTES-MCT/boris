import { PretLisse, type Logement, type Zone } from '$lib/utils/lissage-ptz';
import { describe, it, expect } from 'vitest';

describe('PrêtLissé', () => {
  it('should be elligible', () => {
    const montantEmprunt = 0;
    const zone: Zone = 'B1';
    const apport = 0;
    const tauxEmprunt = 0;
    const dureeEmprunt = 0;
    const nbPersonnes = 1;
    const revenuFiscalReference = 24000;
    const typeLogement: Logement = 'collectif';

    const pretLisse = new PretLisse(
      montantEmprunt,
      zone,
      apport,
      tauxEmprunt,
      dureeEmprunt,
      nbPersonnes,
      revenuFiscalReference,
      typeLogement,
    );

    expect(pretLisse.estElligible()).toBe(true);

    pretLisse.zone = 'A';
    expect(pretLisse.estElligible()).toBe(true);

    pretLisse.zone = 'Abis';
    pretLisse.nbPersonnes = 7;
    pretLisse.revenuFiscalReference = 140000;
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

  it('should not be eligible', () => {
    const montantEmprunt = 0;
    const zone: Zone = 'B1';
    const apport = 0;
    const tauxEmprunt = 0;
    const dureeEmprunt = 0;
    const nbPersonnes = 1;
    const revenuFiscalReference = 54000;
    const typeLogement: Logement = 'collectif';

    const pretLisse = new PretLisse(
      montantEmprunt,
      zone,
      apport,
      tauxEmprunt,
      dureeEmprunt,
      nbPersonnes,
      revenuFiscalReference,
      typeLogement,
    );

    expect(pretLisse.estElligible()).toBe(false);

    pretLisse.zone = 'A';
    expect(pretLisse.estElligible()).toBe(false);

    pretLisse.zone = 'Abis';
    pretLisse.nbPersonnes = 7;
    pretLisse.revenuFiscalReference = 150000;
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
});
