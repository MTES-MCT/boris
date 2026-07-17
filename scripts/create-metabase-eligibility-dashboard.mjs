#!/usr/bin/env node

const METABASE_URL = trimTrailingSlash(
  process.env.METABASE_URL ?? 'https://boris-metabase.osc-fr1.scalingo.io',
);
const API_KEY = process.env.METABASE_API_KEY;
const EMAIL = process.env.METABASE_EMAIL;
const PASSWORD = process.env.METABASE_PASSWORD;
const DATABASE_NAME = process.env.METABASE_DATABASE_NAME;
const COLLECTION_NAME =
  process.env.METABASE_COLLECTION_NAME ?? 'Boris analytics';
const DASHBOARD_NAME =
  process.env.METABASE_DASHBOARD_NAME ?? 'Simulations d’éligibilité BRS';

const sharedTags = {
  start_date: {
    name: 'start_date',
    'display-name': 'Date de début',
    type: 'date',
    required: false,
  },
  end_date: {
    name: 'end_date',
    'display-name': 'Date de fin',
    type: 'date',
    required: false,
  },
  departement_code: {
    name: 'departement_code',
    'display-name': 'Département',
    type: 'text',
    required: false,
  },
  postal_code: {
    name: 'postal_code',
    'display-name': 'Code postal',
    type: 'text',
    required: false,
  },
  eligibility_zone: {
    name: 'eligibility_zone',
    'display-name': 'Zone d’éligibilité',
    type: 'text',
    required: false,
  },
};

const baseJoins = `
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"`;

const baseFilters = `
[[AND DATE(COALESCE(es."landbotDate", es."createdAt")) >= {{start_date}}]]
[[AND DATE(COALESCE(es."landbotDate", es."createdAt")) <= {{end_date}}]]
[[AND d.code = {{departement_code}}]]
[[AND l."postalCode" = {{postal_code}}]]
[[AND es."highestEligibilityZone" = {{eligibility_zone}}]]`;

const cards = [
  {
    name: 'Nombre total de simulations',
    display: 'scalar',
    row: 0,
    col: 0,
    size_x: 6,
    size_y: 3,
    query: `
SELECT COUNT(DISTINCT es.id) AS simulations
${baseJoins}
WHERE TRUE
${baseFilters};`,
  },
  {
    name: 'Simulations éligibles',
    display: 'scalar',
    row: 0,
    col: 6,
    size_x: 6,
    size_y: 3,
    query: `
SELECT COUNT(DISTINCT es.id) AS eligible_simulations
${baseJoins}
WHERE es."highestEligibilityZone" != 'NONE'
[[AND DATE(COALESCE(es."landbotDate", es."createdAt")) >= {{start_date}}]]
[[AND DATE(COALESCE(es."landbotDate", es."createdAt")) <= {{end_date}}]]
[[AND d.code = {{departement_code}}]]
[[AND l."postalCode" = {{postal_code}}]];`,
  },
  {
    name: 'Ménages intéressés contactables',
    display: 'scalar',
    row: 0,
    col: 12,
    size_x: 6,
    size_y: 3,
    query: `
SELECT COUNT(DISTINCT es.id) AS contactable_households
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
WHERE es."highestEligibilityZone" != 'NONE'
  AND es."hasRefusedConnection" = false
  AND es.email IS NOT NULL
  AND es.contribution IS NOT NULL
  AND es.resources IS NOT NULL
${baseFilters};`,
  },
  {
    name: 'Simulations par mois',
    display: 'line',
    row: 3,
    col: 0,
    size_x: 12,
    size_y: 6,
    query: `
SELECT
  DATE_TRUNC('month', COALESCE(es."landbotDate", es."createdAt"))::date AS month,
  COUNT(DISTINCT es.id) AS simulations
${baseJoins}
WHERE TRUE
${baseFilters}
GROUP BY 1
ORDER BY 1;`,
  },
  {
    name: 'Tunnel de conversion',
    display: 'bar',
    row: 3,
    col: 12,
    size_x: 12,
    size_y: 6,
    query: funnelQuery(),
  },
  {
    name: 'Simulations par région en France',
    display: 'map',
    row: 9,
    col: 0,
    size_x: 24,
    size_y: 9,
    visualizationSettings: {
      'map.type': 'region',
      'map.region': 'france_regions',
      'map.dimension': 'region_code',
      'map.metric': 'simulations',
      'map.colors': ['#F2F6FF', '#C8DCF8', '#8EB9ED', '#4E91DB', '#1764B1'],
    },
    query: `
SELECT
  r.code::text AS region_code,
  r.name AS region_name,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
INNER JOIN region r ON r.id = d."regionId"
WHERE TRUE
${baseFilters}
GROUP BY r.code, r.name
ORDER BY simulations DESC;`,
  },
  {
    name: 'Simulations par région',
    display: 'bar',
    row: 18,
    col: 0,
    size_x: 12,
    size_y: 7,
    query: `
SELECT
  r.code AS region_code,
  r.name AS region_name,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
INNER JOIN region r ON r.id = d."regionId"
WHERE TRUE
${baseFilters}
GROUP BY r.code, r.name
ORDER BY simulations DESC;`,
  },
  {
    name: 'Départements les plus demandés',
    display: 'bar',
    row: 18,
    col: 12,
    size_x: 12,
    size_y: 7,
    query: `
SELECT
  d.code AS departement_code,
  d.name AS departement_name,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
WHERE TRUE
${baseFilters}
GROUP BY d.code, d.name
ORDER BY simulations DESC;`,
  },
  {
    name: 'Codes postaux les plus demandés',
    display: 'table',
    row: 25,
    col: 0,
    size_x: 8,
    size_y: 7,
    query: `
SELECT
  l."postalCode" AS postal_code,
  d.code AS departement_code,
  COUNT(DISTINCT es.id) AS simulations,
  COUNT(*) AS desired_location_lines
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
WHERE l."postalCode" IS NOT NULL
${baseFilters}
GROUP BY l."postalCode", d.code
ORDER BY simulations DESC;`,
  },
  {
    name: 'Catégories de revenus',
    display: 'bar',
    row: 25,
    col: 8,
    size_x: 8,
    size_y: 7,
    query: `
SELECT revenue_category, simulations
FROM (
  SELECT
    CASE
      WHEN es.resources IS NULL THEN 'Non renseigné'
      WHEN es.resources < 20000 THEN '< 20k'
      WHEN es.resources < 30000 THEN '20k-30k'
      WHEN es.resources < 40000 THEN '30k-40k'
      WHEN es.resources < 55000 THEN '40k-55k'
      ELSE '55k+'
    END AS revenue_category,
    COUNT(DISTINCT es.id) AS simulations
  ${baseJoins}
  WHERE TRUE
  ${baseFilters}
  GROUP BY revenue_category
) revenue_categories
ORDER BY
  CASE revenue_category
    WHEN '< 20k' THEN 1
    WHEN '20k-30k' THEN 2
    WHEN '30k-40k' THEN 3
    WHEN '40k-55k' THEN 4
    WHEN '55k+' THEN 5
    ELSE 6
  END;`,
  },
  {
    name: 'Typologie de logement recherchée',
    display: 'bar',
    row: 25,
    col: 16,
    size_x: 8,
    size_y: 7,
    query: `
SELECT
  COALESCE(es."housingType"::text, 'Non renseigné') AS housing_type,
  COUNT(DISTINCT es.id) AS simulations
${baseJoins}
WHERE TRUE
${baseFilters}
GROUP BY housing_type
ORDER BY housing_type;`,
  },
  {
    name: 'Taille du ménage',
    display: 'bar',
    row: 32,
    col: 0,
    size_x: 8,
    size_y: 7,
    query: `
SELECT
  COALESCE(es."householdSize"::text, 'Non renseigné') AS household_size,
  COUNT(DISTINCT es.id) AS simulations
${baseJoins}
WHERE TRUE
${baseFilters}
GROUP BY household_size
ORDER BY household_size;`,
  },
  {
    name: 'Situation actuelle de logement',
    display: 'bar',
    row: 32,
    col: 8,
    size_x: 8,
    size_y: 7,
    query: `
SELECT
  CASE es."propertySituation"::text
    WHEN 'PROPRIETAIRE' THEN 'Propriétaire'
    WHEN 'LOCATAIRE_SOCIAL' THEN 'Locataire social'
    WHEN 'LOCATAIRE_PRIVE' THEN 'Locataire privé'
    WHEN 'HEBERGE' THEN 'Hébergé'
    WHEN 'AUTRE' THEN 'Autre'
    ELSE 'Non renseigné'
  END AS property_situation,
  COUNT(DISTINCT es.id) AS simulations
${baseJoins}
WHERE TRUE
${baseFilters}
GROUP BY property_situation
ORDER BY simulations DESC;`,
  },
  {
    name: 'Connaissance du BRS',
    display: 'bar',
    row: 32,
    col: 16,
    size_x: 8,
    size_y: 7,
    query: `
SELECT
  CASE
    WHEN es."hadBrsKnowledge" = true THEN 'Connaissait le BRS'
    WHEN es."hadBrsKnowledge" = false THEN 'Ne connaissait pas le BRS'
    ELSE 'Non renseigné'
  END AS brs_awareness,
  COUNT(DISTINCT es.id) AS simulations
${baseJoins}
WHERE TRUE
${baseFilters}
GROUP BY brs_awareness
ORDER BY simulations DESC;`,
  },
  {
    name: 'Zone d’éligibilité',
    display: 'bar',
    row: 39,
    col: 0,
    size_x: 8,
    size_y: 7,
    query: `
SELECT
  CASE es."highestEligibilityZone"::text
    WHEN 'A_AND_ABIS' THEN 'A / Abis'
    WHEN 'B1' THEN 'B1'
    WHEN 'B2_AND_C' THEN 'B2 / C'
    WHEN 'NONE' THEN 'Non éligible'
    ELSE 'Non renseigné'
  END AS eligibility_zone,
  COUNT(DISTINCT es.id) AS simulations
${baseJoins}
WHERE TRUE
[[AND DATE(COALESCE(es."landbotDate", es."createdAt")) >= {{start_date}}]]
[[AND DATE(COALESCE(es."landbotDate", es."createdAt")) <= {{end_date}}]]
[[AND d.code = {{departement_code}}]]
[[AND l."postalCode" = {{postal_code}}]]
GROUP BY eligibility_zone
ORDER BY simulations DESC;`,
  },
  {
    name: 'Situation professionnelle',
    display: 'bar',
    row: 39,
    col: 8,
    size_x: 16,
    size_y: 7,
    query: `
SELECT
  CASE es."employmentStatus"::text
    WHEN 'SALARIE_PRIVE_NON_AGRICOLE' THEN 'Salarié privé non agricole'
    WHEN 'SALARIE_AGRICOLE' THEN 'Salarié agricole'
    WHEN 'SALARIE_PUBLIC_OU_FONCTIONNAIRE' THEN 'Salarié public / fonctionnaire'
    WHEN 'INDEPENDANT' THEN 'Indépendant'
    WHEN 'SALARIE_GROUPE_LA_POSTE' THEN 'Salarié groupe La Poste'
    WHEN 'SANS_ACTIVITE_PROFESSIONNELLE' THEN 'Sans activité professionnelle'
    WHEN 'RETRAITE' THEN 'Retraité'
    ELSE 'Non renseigné'
  END AS employment_status,
  COUNT(DISTINCT es.id) AS simulations
${baseJoins}
WHERE TRUE
${baseFilters}
GROUP BY employment_status
ORDER BY simulations DESC;`,
  },
];

const visualizationSettings = {
  scalar: {},
  table: {},
  line: {
    'graph.dimensions': ['month'],
    'graph.metrics': ['simulations'],
  },
  bar: {},
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

async function main() {
  if (!API_KEY && (!EMAIL || !PASSWORD)) {
    throw new Error(
      'Set METABASE_API_KEY or METABASE_EMAIL and METABASE_PASSWORD.',
    );
  }

  const sessionHeaders = await authenticate();
  await setupCustomGeoJson(sessionHeaders);
  const database = await findDatabase(sessionHeaders);
  const collection = await findOrCreateCollection(sessionHeaders);
  const dashboard = await createDashboard(sessionHeaders, collection.id);

  const createdCards = [];
  for (const card of cards) {
    const createdCard = await createCard(
      sessionHeaders,
      database.id,
      collection.id,
      card,
    );
    createdCards.push({ ...card, id: createdCard.id });
    console.log(`Created card ${createdCard.id}: ${card.name}`);
  }

  for (const card of createdCards) {
    await addCardToDashboard(sessionHeaders, dashboard.id, card);
  }

  console.log(`Dashboard created: ${METABASE_URL}/dashboard/${dashboard.id}`);
}

async function authenticate() {
  if (API_KEY) {
    return { 'x-api-key': API_KEY };
  }

  const session = await api('/api/session', {
    method: 'POST',
    body: {
      username: EMAIL,
      password: PASSWORD,
    },
  });

  return { 'x-metabase-session': session.id };
}

async function setupCustomGeoJson(headers) {
  const current = await api('/api/setting/custom-geojson', { headers });

  await api('/api/setting/custom-geojson', {
    method: 'PUT',
    headers,
    body: {
      value: {
        ...current,
        france_regions: {
          name: 'France regions',
          url: 'https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/regions.geojson',
          region_key: 'code',
          region_name: 'nom',
        },
      },
    },
  });
}

async function findDatabase(headers) {
  const result = await api('/api/database', { headers });
  const databases = result.data ?? result;
  const candidates = databases.filter((database) => !database.is_sample);

  if (DATABASE_NAME) {
    const database = candidates.find((candidate) =>
      candidate.name.toLowerCase().includes(DATABASE_NAME.toLowerCase()),
    );

    if (!database) {
      throw new Error(`Could not find Metabase database: ${DATABASE_NAME}`);
    }

    return database;
  }

  if (candidates.length === 1) {
    return candidates[0];
  }

  const preferred = candidates.find((database) =>
    /boris|backend|postgres/i.test(database.name),
  );

  if (preferred) {
    return preferred;
  }

  throw new Error(
    `Set METABASE_DATABASE_NAME. Available databases: ${candidates
      .map((database) => database.name)
      .join(', ')}`,
  );
}

async function findOrCreateCollection(headers) {
  const result = await api('/api/collection', { headers });
  const collections = result.data ?? result;
  const existing = collections.find(
    (collection) => collection.name === COLLECTION_NAME,
  );

  if (existing) {
    return existing;
  }

  return api('/api/collection', {
    method: 'POST',
    headers,
    body: {
      name: COLLECTION_NAME,
      color: '#509EE3',
    },
  });
}

async function createDashboard(headers, collectionId) {
  return api('/api/dashboard', {
    method: 'POST',
    headers,
    body: {
      name: DASHBOARD_NAME,
      description:
        'Profil des ménages intéressés par le BRS, zones recherchées et types de logements souhaités.',
      collection_id: collectionId,
      parameters: [
        parameter('start_date', 'Date de début', 'date/single'),
        parameter('end_date', 'Date de fin', 'date/single'),
        parameter('departement_code', 'Département', 'category'),
        parameter('postal_code', 'Code postal', 'category'),
        parameter('eligibility_zone', 'Zone d’éligibilité', 'category'),
      ],
    },
  });
}

async function createCard(headers, databaseId, collectionId, card) {
  return api('/api/card', {
    method: 'POST',
    headers,
    body: {
      name: card.name,
      display: card.display,
      visualization_settings: visualizationSettingsFor(card),
      dataset_query: {
        database: databaseId,
        type: 'native',
        native: {
          query: normalizeSql(card.query),
          'template-tags': templateTagsFor(card.query),
        },
      },
      collection_id: collectionId,
    },
  });
}

async function addCardToDashboard(headers, dashboardId, card) {
  const dashboard = await api(`/api/dashboard/${dashboardId}`, { headers });
  const existingCards = dashboard.dashcards ?? [];
  const temporaryDashcardId = -(existingCards.length + 1);

  await api(`/api/dashboard/${dashboardId}/cards`, {
    method: 'PUT',
    headers,
    body: {
      cards: [
        ...existingCards.map((dashcard) => ({
          id: dashcard.id,
          card_id: dashcard.card_id,
          row: dashcard.row,
          col: dashcard.col,
          size_x: dashcard.size_x,
          size_y: dashcard.size_y,
          series: dashcard.series ?? [],
          inline_parameters: dashcard.inline_parameters ?? [],
          parameter_mappings: dashcard.parameter_mappings ?? [],
          visualization_settings: dashcard.visualization_settings ?? {},
        })),
        {
          id: temporaryDashcardId,
          card_id: card.id,
          row: card.row,
          col: card.col,
          size_x: card.size_x,
          size_y: card.size_y,
          series: [],
          inline_parameters: [],
          visualization_settings: visualizationSettingsFor(card),
          parameter_mappings: parameterMappings(card),
        },
      ],
      tabs: dashboard.tabs ?? [],
    },
  });
}

function templateTagsFor(query) {
  const tags = {};

  for (const [name, tag] of Object.entries(sharedTags)) {
    if (query.includes(`{{${name}}}`)) {
      tags[name] = tag;
    }
  }

  return tags;
}

function parameterMappings(card) {
  return Object.keys(templateTagsFor(card.query)).map((name) => ({
    parameter_id: name,
    card_id: card.id,
    target: ['variable', ['template-tag', name]],
  }));
}

function visualizationSettingsFor(card) {
  return card.visualizationSettings ?? visualizationSettings[card.display] ?? {};
}

function parameter(id, name, type) {
  return {
    id,
    name,
    slug: id,
    type,
    sectionId: 'sql',
  };
}

function funnelQuery() {
  const filtered = (where) => `
SELECT '${where.label}' AS step, COUNT(DISTINCT es.id) AS count
${baseJoins}
WHERE ${where.condition}
${baseFilters}`;

  return [
    filtered({ label: '1. Simulation démarrée', condition: 'TRUE' }),
    filtered({
      label: '2. Composition du ménage renseignée',
      condition:
        '(es."householdSize" IS NOT NULL OR es."hasDisability" IS NOT NULL)',
    }),
    filtered({
      label: '3. Éligible',
      condition:
        '(es."householdSize" IS NOT NULL OR es."hasDisability" IS NOT NULL) AND es."highestEligibilityZone" != \'NONE\'',
    }),
    filtered({
      label: '4. Souhaite être recontacté',
      condition:
        '(es."householdSize" IS NOT NULL OR es."hasDisability" IS NOT NULL) AND es."highestEligibilityZone" != \'NONE\' AND es."hasRefusedConnection" = false',
    }),
    filtered({
      label: '5. Email renseigné',
      condition:
        '(es."householdSize" IS NOT NULL OR es."hasDisability" IS NOT NULL) AND es."highestEligibilityZone" != \'NONE\' AND es."hasRefusedConnection" = false AND es.email IS NOT NULL',
    }),
  ].join('\nUNION ALL\n');
}

async function api(path, options = {}) {
  const response = await fetch(`${METABASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'content-type': 'application/json',
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `${options.method ?? 'GET'} ${path} failed: ${response.status} ${body}`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function normalizeSql(sql) {
  return sql.trim().replace(/\n{3,}/g, '\n\n');
}

function trimTrailingSlash(value) {
  return value.replace(/\/$/, '');
}
