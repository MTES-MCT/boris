export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14')
];

export const server_loads = [];

export const dictionary = {
		"/(accueil)": [2],
		"/accessibilite": [3],
		"/blog": [~4],
		"/blog/[slug]": [~5],
		"/conditions-generales-d-utilisation": [6],
		"/mentions-legales": [7],
		"/notre-mission": [8],
		"/nous-contacter": [9],
		"/organismes-fonciers-solidaires": [~10],
		"/politique-de-confidentialite": [11],
		"/simulateur-eligibilite": [~12],
		"/tout-savoir-sur-le-bail-reel-solidaire-brs": [13],
		"/tout-savoir-sur-le-bail-reel-solidaire-brs/[slug]": [~14]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';