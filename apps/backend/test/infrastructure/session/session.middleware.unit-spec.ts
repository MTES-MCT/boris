import { sessionMiddlewares } from 'src/infrastructure/session/session.middleware';

describe('sessionMiddlewares', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalSessionSecret = process.env.SESSION_SECRET;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.SESSION_SECRET = originalSessionSecret;
  });

  it('fails fast outside tests when SESSION_SECRET is missing', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.SESSION_SECRET;

    expect(() => sessionMiddlewares({} as any)).toThrow(
      'SESSION_SECRET must be set',
    );
  });
});
