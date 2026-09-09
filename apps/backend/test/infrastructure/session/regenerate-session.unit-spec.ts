import { regenerateSession } from 'src/infrastructure/session/regenerate-session';

describe('regenerateSession', () => {
  it('rotates the session while preserving non-authentication data', async () => {
    const oldSession = {
      cookie: { path: '/' },
      passport: { user: 'old-user' },
      flash: { info: ['hello'] },
      returnTo: '/ofs',
    };
    const newSession = {
      cookie: { path: '/' },
      regenerate: (callback: (error?: Error) => void) => callback(),
    };
    const req = { session: oldSession } as any;
    oldSession['regenerate' as keyof typeof oldSession] = ((
      callback: () => void,
    ) => {
      req.session = newSession;
      callback();
    }) as never;

    await regenerateSession(req);

    expect(req.session).toMatchObject({
      flash: { info: ['hello'] },
      returnTo: '/ofs',
    });
    expect(req.session.passport).toBeUndefined();
  });
});
