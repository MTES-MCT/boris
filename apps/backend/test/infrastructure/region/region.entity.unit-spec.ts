import { bretagne } from 'test/mocks/integration/region';

describe('RegionEntity', () => {
  it('getters', () => {
    expect(bretagne.name).toBe('Bretagne');
  });

  it('setters', () => {
    bretagne.name = 'bzh';

    expect(bretagne.name).toBe('bzh');
  });
});
