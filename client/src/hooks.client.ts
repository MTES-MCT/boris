import { handleErrorWithSentry } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

console.log(location.host.includes('localhost'));

Sentry.init({
  dsn: 'https://a08d74bb41ceec5e916f126744df60ea@sentry.incubateur.net/207',

  tracesSampleRate: 1.0,
  enabled: !location.host.includes('localhost'),
});

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = handleErrorWithSentry();
