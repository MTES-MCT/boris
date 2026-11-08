import { sessionMiddlewares } from 'src/infrastructure/session/session.middleware';
import { Logger } from '@nestjs/common';
import { createHmac } from 'node:crypto';
import { IncomingMessage, ServerResponse } from 'node:http';
import { Socket } from 'node:net';
import { Request, Response } from 'express';
import { DataSource } from 'typeorm';

describe('sessionMiddlewares', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalSessionSecret = process.env.SESSION_SECRET;

  afterEach(() => {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalSessionSecret === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = originalSessionSecret;
    jest.restoreAllMocks();
  });

  it('fails fast outside tests when SESSION_SECRET is missing', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.SESSION_SECRET;

    expect(() => sessionMiddlewares({} as DataSource)).toThrow(
      'SESSION_SECRET must be set',
    );
  });

  it('reports database errors without disabling sessions on subsequent requests', async () => {
    process.env.NODE_ENV = 'production';
    process.env.SESSION_SECRET = 'session-recovery-test';
    const logError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const databaseError = new Error('temporary database failure');
    const getOne = jest
      .fn()
      .mockRejectedValueOnce(databaseError)
      .mockResolvedValue({
        json: JSON.stringify({
          cookie: { path: '/', maxAge: 86400000 },
          recovered: true,
        }),
      });
    const query = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getOne,
    };
    const middlewares = sessionMiddlewares({
      getRepository: () => ({ createQueryBuilder: () => query }),
    } as unknown as DataSource);

    const signature = createHmac('sha256', process.env.SESSION_SECRET)
      .update('session-id')
      .digest('base64')
      .replace(/=+$/, '');
    const cookie = `${process.env.SESSION_COOKIE_NAME || 'boris.sid'}=${encodeURIComponent(`s:session-id.${signature}`)}`;

    const run = async (cookie?: string) => {
      const req = new IncomingMessage(new Socket()) as Request;
      req.url = req.originalUrl = '/api/brs-diffusion-websites';
      if (cookie) req.headers.cookie = cookie;
      const res = new ServerResponse(req) as unknown as Response;
      for (const middleware of middlewares) {
        await new Promise<void>((resolve, reject) => {
          middleware(req, res, (error?: unknown) => {
            if (error) {
              reject(error instanceof Error ? error : new Error(String(error)));
            } else {
              resolve();
            }
          });
        });
      }
      return req;
    };

    await expect(run(cookie)).rejects.toBe(databaseError);

    // Anonymous API requests must still reach Passport while the database is unavailable.
    expect((await run()).session).toBeDefined();
    expect(getOne).toHaveBeenCalledTimes(1);

    // An existing session is loaded again once the database recovers.
    expect((await run(cookie)).session).toMatchObject({ recovered: true });
    expect(getOne).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenCalledWith(
      'Session database operation failed',
      databaseError.stack,
    );
  });
});
