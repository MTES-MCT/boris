import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://a08d74bb41ceec5e916f126744df60ea@sentry.incubateur.net/207',
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const myErrorHandler = ({ error, event }) => {
  console.error('An error occurred on the server side:', error, event);

  Sentry.captureException(error);
};

export const handleError = Sentry.handleErrorWithSentry(myErrorHandler);
