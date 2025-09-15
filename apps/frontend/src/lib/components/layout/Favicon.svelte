<script lang="ts">
  import appleTouchIconHref from '@gouvfr/dsfr/dist/favicon/apple-touch-icon.png';
  import iconSvg from '@gouvfr/dsfr/dist/favicon/favicon.svg';
  import iconIco from '/favicon.ico';
  import webmanifest from '@gouvfr/dsfr/dist/favicon/manifest.webmanifest';
</script>

<svelte:head>
  <link
    rel="apple-touch-icon"
    href={appleTouchIconHref} />
  <!-- 180×180 -->
  <link
    rel="icon"
    href={iconSvg}
    type="image/svg+xml" />
  <link
    rel="shortcut icon"
    href={iconIco}
    type="image/x-icon" />
  <!-- 32×32 -->
  <link
    rel="manifest"
    href={webmanifest}
    crossorigin="use-credentials" />
  <!-- Dans le fichier manifest.webmanifest aussi, modifier les chemins vers les images -->
</svelte:head>
