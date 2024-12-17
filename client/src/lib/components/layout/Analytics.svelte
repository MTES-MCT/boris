<script lang="ts">
  import { page } from '$app/stores';

  $effect(() => {
    // @ts-expect-error cannot find name
    if (typeof gtag !== 'undefined') {
      // @ts-expect-error cannot name
      // eslint-disable-next-line no-undef
      gtag('config', 'G-EDC0QMMK4J', {
        page_title: document.title,
        page_path: $page.url.pathname,
      });
    }
  });
</script>

<svelte:head>
  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-EDC0QMMK4J">
  </script>
  <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'G-EDC0QMMK4J');
  </script>
</svelte:head>
