<script lang="ts">
  import { page } from '$app/state';

  const SITE_URL = 'https://www.boris.beta.gouv.fr';
  const DEFAULT_SHARE_IMAGE = '/og-image.svg';

  type JsonLd = Record<string, unknown>;

  type Props = {
    title: string;
    description: string;
    pathname?: string;
    imagePath?: string;
    type?: 'website' | 'article';
    jsonLd?: JsonLd | JsonLd[];
  };

  const {
    title,
    description,
    pathname,
    imagePath = DEFAULT_SHARE_IMAGE,
    type = 'website',
    jsonLd,
  }: Props = $props();

  const normalizedPathname = $derived(normalizePathname(pathname ?? page.url.pathname));
  const canonicalUrl = $derived(toAbsoluteUrl(normalizedPathname));
  const imageUrl = $derived(toAbsoluteUrl(imagePath));
  const schemas = $derived(
    jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [],
  );

  function normalizePathname(pathname: string): string {
    if (!pathname || pathname === '/') {
      return '/';
    }

    const normalizedPathname = pathname.startsWith('/')
      ? pathname
      : `/${pathname}`;

    return normalizedPathname.endsWith('/')
      ? normalizedPathname.slice(0, -1)
      : normalizedPathname;
  }

  function toAbsoluteUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const normalizedPath = normalizePathname(path);

    return normalizedPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${normalizedPath}`;
  }
</script>

<svelte:head>
  <link
    rel="canonical"
    href={canonicalUrl} />
  <meta
    property="og:title"
    content={title} />
  <meta
    property="og:description"
    content={description} />
  <meta
    property="og:image"
    content={imageUrl} />
  <meta
    property="og:url"
    content={canonicalUrl} />
  <meta
    property="og:type"
    content={type} />
  <meta
    property="og:locale"
    content="fr_FR" />

  {#each schemas as schema}
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  {/each}
</svelte:head>
