import { finistere } from 'test/mocks/departement';

describe('DepartementEntity', () => {
  it('getters', () => {
    expect(finistere.name).toBe('Finistère');
    expect(finistere.code).toBe('29');
  });

  it('setters', () => {
    finistere.name = 'Penn ar bed';
    finistere.code = '0';

    expect(finistere.name).toBe('Penn ar bed');
    expect(finistere.code).toBe('0');
  });
});
