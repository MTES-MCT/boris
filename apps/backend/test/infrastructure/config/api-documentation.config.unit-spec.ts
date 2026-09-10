import { configureApiDocumentation } from 'src/infrastructure/config/api-documentation.config';

describe('configureApiDocumentation', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('does not expose Swagger in production', () => {
    process.env.NODE_ENV = 'production';
    expect(() => configureApiDocumentation({} as any)).not.toThrow();
  });
});
