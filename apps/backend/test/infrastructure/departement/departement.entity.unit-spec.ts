import { finistere } from 'test/mocks/departement';

describe('DepartementEntity', () => {
  it('getters', () => {
    expect(finistere.name).toBe('Finistère');
    expect(finistere.zipcode).toBe(29);
  });

  it('setters', () => {
    finistere.name = 'Penn ar bed';
    finistere.zipcode = 0;

    expect(finistere.name).toBe('Penn ar bed');
    expect(finistere.zipcode).toBe(0);
  });
});
