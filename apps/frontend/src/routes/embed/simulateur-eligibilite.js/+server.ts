import { type RequestHandler } from '@sveltejs/kit';

export const prerender = false;

export const GET: RequestHandler = () => {
  const script = `
(function () {
  var script = document.currentScript;
  if (!script) return;

  var containerId = script.getAttribute('data-container');
  var container = containerId ? document.getElementById(containerId) : script.parentElement;
  if (!container) return;

  var params = new URLSearchParams();
  params.set('parentOrigin', window.location.origin);

  var mapping = {
    'data-partner-name': 'partnerName',
    'data-primary-color': 'primaryColor',
    'data-logo-url': 'logoUrl',
    'data-hide-boris-branding': 'hideBorisBranding',
    'data-intro': 'intro',
    'data-selection-departments': 'selectionDepartments',
    'data-selection-citycodes': 'selectionCitycodes'
  };

  Object.keys(mapping).forEach(function (attribute) {
    var value = script.getAttribute(attribute);
    if (value) params.set(mapping[attribute], value);
  });

  var iframe = document.createElement('iframe');
  iframe.src = new URL('/embed/simulateur-eligibilite?' + params.toString(), script.src).toString();
  iframe.title = "Simulateur d'éligibilité au Bail Réel Solidaire";
  iframe.style.width = '100%';
  iframe.style.minHeight = '720px';
  iframe.style.border = '0';
  iframe.loading = 'lazy';

  container.innerHTML = '';
  container.appendChild(iframe);

  window.addEventListener('message', function (event) {
    if (event.origin !== new URL(script.src).origin) return;
    if (!event.data || event.data.type !== 'boris:resize') return;
    if (typeof event.data.height !== 'number') return;
    iframe.style.height = Math.max(event.data.height, 720) + 'px';
  });
})();
`;

  return new Response(script, {
    headers: {
      'content-type': 'application/javascript; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
