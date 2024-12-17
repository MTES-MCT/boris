import * as Sentry from '@sentry/node';
import type { HandleServerError } from '@sveltejs/kit';

Sentry.init({
  dsn: 'https://a08d74bb41ceec5e916f126744df60ea@sentry.incubateur.net/207',

  tracesSampleRate: 1.0,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});

export const handleError: HandleServerError = async ({
  error,
  event,
  status,
}) => {
  const errorId = crypto.randomUUID();

  // example integration with https://sentry.io/
  Sentry.captureException(error, {
    extra: { event, errorId, status },
  });

  return {
    message: 'Whoops!',
    errorId,
  };
};
