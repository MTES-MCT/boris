import { type ServerLoad } from '@sveltejs/kit';

export const prerender = false;

const parseList = (value: string | null) =>
  value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean) || [];

export const load: ServerLoad = async ({ fetch, setHeaders, url }) => {
  const parentOrigin = url.searchParams.get('parentOrigin') || '';
  const response = await fetch(
    `/api/embed/origin?parentOrigin=${encodeURIComponent(parentOrigin)}`,
  );

  if (response.ok && parentOrigin) {
    setHeaders({
      'content-security-policy': `frame-ancestors ${new URL(parentOrigin).origin}`,
    });
  }

  return {
    authorized: response.ok,
    parentOrigin,
    selectionDepartments: parseList(url.searchParams.get('selectionDepartments')),
    selectionCitycodes: parseList(url.searchParams.get('selectionCitycodes')),
    partnerName: url.searchParams.get('partnerName') || '',
    primaryColor: url.searchParams.get('primaryColor') || '',
    logoUrl: url.searchParams.get('logoUrl') || '',
    hideBorisBranding: url.searchParams.get('hideBorisBranding') === 'true',
    intro: url.searchParams.get('intro') || 'default',
  };
};
