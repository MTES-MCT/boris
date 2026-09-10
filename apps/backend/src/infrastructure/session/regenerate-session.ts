import { Request } from 'express';

export async function regenerateSession(req: Request): Promise<void> {
  const session = req.session as typeof req.session & { passport?: unknown };
  const preservedData = Object.fromEntries(
    Object.entries(session).filter(
      ([key]) => key !== 'cookie' && key !== 'passport',
    ),
  );

  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((error) => {
      if (error) {
        reject(
          error instanceof Error
            ? error
            : new Error('Failed to regenerate session'),
        );
        return;
      }

      Object.assign(req.session, preservedData);
      resolve();
    });
  });
}
