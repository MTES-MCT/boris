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
  <!-- Google tag (gtag.js) -->
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

  <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=AW-16498124252"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', 'AW-16498124252');
  </script>
  <!-- End Google tag (gtag.js) -->

  <!-- Meta Pixel Code -->
  <script>
    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      'script',
      'https://connect.facebook.net/en_US/fbevents.js',
    );
    fbq('init', '499989860182745');
    fbq('track', 'PageView');
  </script>

  <noscript>
    <img
      height="1"
      width="1"
      style="display:none"
      src="https://www.facebook.com/tr?id=499989860182745&ev=PageView&noscript=1"
      alt="" />
  </noscript>
  <!-- End Meta Pixel Code -->
</svelte:head>
