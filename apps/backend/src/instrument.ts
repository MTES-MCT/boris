import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV !== 'development',
  integrations: [
    Sentry.httpIntegration({
      ignoreIncomingRequestBody: (url) =>
        /\/(?:api\/portal\/)?auth(?:\/|\?|$)/i.test(url),
    }),
  ],
});
