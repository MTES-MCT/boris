import { PasswordHasher } from 'src/infrastructure/user/password/password-hasher';

describe('PasswordHasher', () => {
  let passwordHasher: PasswordHasher;

  beforeEach(() => {
    passwordHasher = new PasswordHasher();
  });

  it('should hash a password', async () => {
    const password = 'myPassword';
    const hash = await passwordHasher.hash(password);

    expect(hash).not.toBe(password);
    expect(typeof hash).toBe('string');
    expect(hash.length).toBeGreaterThan(10);
  });

  it('should compare password and be a success', async () => {
    const password = 'myPassword';
    const hash = await passwordHasher.hash(password);

    expect(await passwordHasher.compare(password, hash)).toBe(true);
  });

  it('should compare password and be a failure', async () => {
    const password = 'myPassword';
    const wrongPassword = 'wrongPassword';
    const hash = await passwordHasher.hash(password);

    expect(await passwordHasher.compare(wrongPassword, hash)).toBe(false);
  });
});
