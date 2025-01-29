<!--
This is just a very simple page with a button to throw an example error.
Feel free to delete this file and the entire sentry route.
-->

<script>
  import * as Sentry from '@sentry/sveltekit';

  function getSentryData() {
    Sentry.startSpan(
      {
        name: 'Example Frontend Span',
        op: 'test',
      },
      async () => {
        const res = await fetch('/sentry-example');
        if (!res.ok) {
          throw new Error('Sentry Example Frontend Error');
        }
      },
    );
  }
</script>

<title>Sentry Onboarding</title>

<h1>Sentry test page</h1>

<p>1. Send us a sample error:</p>
<button
  type="button"
  on:click={getSentryData}>
  Throw error!
</button>
