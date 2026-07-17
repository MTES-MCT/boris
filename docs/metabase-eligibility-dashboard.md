# Tableau de bord Metabase des simulations d’éligibilité

Ce tableau de bord sert à comprendre qui s’intéresse au BRS, où les ménages cherchent un logement, et quel type de logement ils souhaitent.

Le modèle de données Boris contient une ligne `eligibility_simulation` par simulation et zéro, une ou plusieurs lignes `location` par simulation. Utiliser `COUNT(DISTINCT es.id)` pour les graphiques au niveau simulation/ménage. Utiliser `COUNT(*)` sur `location` seulement quand on veut compter les lieux recherchés/lignes de contact.

## Filtres du tableau de bord

Créer ces filtres de tableau de bord et les connecter aux mêmes variables sur chaque question SQL :

| Filtre | Variable SQL | Type de variable | Correspondance Metabase |
| --- | --- | --- | --- |
| Période | `submitted_at` | Field filter | `eligibility_simulation.createdAt`, alias `es.createdAt` |
| Département | `departement_code` | Field filter | `departement.code`, alias `d.code` |
| Code postal | `postal_code` | Field filter | `location.postalCode`, alias `l.postalCode` |
| Zone d’éligibilité | `eligibility_zone` | Field filter | `eligibility_simulation.highestEligibilityZone`, alias `es.highestEligibilityZone` |

En SQL natif, les field filters s’écrivent `[[AND {{departement_code}}]]`, pas `d.code = {{departement_code}}`. Dans le panneau de configuration de la variable, renseigner la table et l’alias de champ demandés par Metabase.

Les requêtes ci-dessous incluent ces filtres :

```sql
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
```

Pour `submitted_at`, `createdAt` suffit pour la plupart des cartes. Pour utiliser `COALESCE(es."landbotDate", es."createdAt")`, préférer des variables de date simples `start_date` et `end_date`, car les field filters Metabase se branchent sur un vrai champ de base de données, pas sur une expression.

## Cartes principales

### Nombre total de simulations

Visualisation : nombre.

```sql
SELECT COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]];
```

### Simulations éligibles

Visualisation : nombre.

```sql
SELECT COUNT(DISTINCT es.id) AS eligible_simulations
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE es."highestEligibilityZone" != 'NONE'
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]];
```

### Ménages intéressés contactables

Cette carte reprend la logique du portail : ménage éligible qui accepte d’être recontacté et qui a renseigné son email, son apport et ses ressources.

Visualisation : nombre.

```sql
SELECT COUNT(DISTINCT es.id) AS contactable_households
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
WHERE es."highestEligibilityZone" != 'NONE'
  AND es."hasRefusedConnection" = false
  AND es.email IS NOT NULL
  AND es.contribution IS NOT NULL
  AND es.resources IS NOT NULL
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]];
```

### Simulations par mois

Visualisation : courbe. Axe X `month`, axe Y `simulations`.

```sql
SELECT
  DATE_TRUNC('month', COALESCE(es."landbotDate", es."createdAt"))::date AS month,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY 1
ORDER BY 1;
```

### Tunnel de conversion

Visualisation : tunnel ou graphique en barres.

```sql
SELECT '1. Simulation démarrée' AS step, COUNT(DISTINCT es.id) AS count
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]

UNION ALL
SELECT '2. Composition du ménage renseignée', COUNT(DISTINCT es.id)
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE (es."householdSize" IS NOT NULL OR es."hasDisability" IS NOT NULL)
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]

UNION ALL
SELECT '3. Éligible', COUNT(DISTINCT es.id)
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE (es."householdSize" IS NOT NULL OR es."hasDisability" IS NOT NULL)
  AND es."highestEligibilityZone" != 'NONE'
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]

UNION ALL
SELECT '4. Souhaite être recontacté', COUNT(DISTINCT es.id)
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE (es."householdSize" IS NOT NULL OR es."hasDisability" IS NOT NULL)
  AND es."highestEligibilityZone" != 'NONE'
  AND es."hasRefusedConnection" = false
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]

UNION ALL
SELECT '5. Email renseigné', COUNT(DISTINCT es.id)
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE (es."householdSize" IS NOT NULL OR es."hasDisability" IS NOT NULL)
  AND es."highestEligibilityZone" != 'NONE'
  AND es."hasRefusedConnection" = false
  AND es.email IS NOT NULL
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]];
```

## Geography

### Simulations par région en France

Visualisation : carte régionale. Configurer d’abord une carte GeoJSON personnalisée dans Metabase :

```json
{
  "france_regions": {
    "name": "France regions",
    "url": "https://cdn.jsdelivr.net/gh/gregoiredavid/france-geojson@master/regions.geojson",
    "region_key": "code",
    "region_name": "nom"
  }
}
```

Puis régler la visualisation de la carte :

| Paramètre | Valeur |
| --- | --- |
| Type de carte | Carte régionale |
| Carte régionale | France regions |
| Champ région | `region_code` |
| Métrique | `simulations` |

Au survol, Metabase affiche la région et le nombre de simulations.

```sql
SELECT
  r.code::text AS region_code,
  r.name AS region_name,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
INNER JOIN region r ON r.id = d."regionId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY r.code, r.name
ORDER BY simulations DESC;
```

### Map by desired city

Visualization: Grid map for many rows, pin map for small filtered datasets.

```sql
SELECT
  l.latitude,
  l.longitude,
  COALESCE(l.city, l.municipality, l.label) AS city,
  d.code AS departement_code,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
WHERE l.latitude IS NOT NULL
  AND l.longitude IS NOT NULL
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY l.latitude, l.longitude, city, d.code
ORDER BY simulations DESC;
```

### Départements les plus demandés

Visualization: Bar chart or table.

```sql
SELECT
  d.code AS departement_code,
  d.name AS departement_name,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY d.code, d.name
ORDER BY simulations DESC;
```

### Codes postaux les plus demandés

Visualization: Table. This is useful as a drill-down card when a department filter is selected.

```sql
SELECT
  l."postalCode" AS postal_code,
  d.code AS departement_code,
  COUNT(DISTINCT es.id) AS simulations,
  COUNT(*) AS desired_location_lines
FROM eligibility_simulation es
INNER JOIN location l ON l."eligibilitySimulationId" = es.id
INNER JOIN departement d ON d.id = l."departementId"
WHERE l."postalCode" IS NOT NULL
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY l."postalCode", d.code
ORDER BY simulations DESC;
```

## Profil des ménages

### Catégories de revenus

Visualization: Bar chart or table.

```sql
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
  FROM eligibility_simulation es
  LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
  LEFT JOIN departement d ON d.id = l."departementId"
  WHERE TRUE
  [[AND {{submitted_at}}]]
  [[AND {{departement_code}}]]
  [[AND {{postal_code}}]]
  [[AND {{eligibility_zone}}]]
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
  END;
```

### Typologie de logement recherchée

Visualization: Bar chart.

```sql
SELECT
  COALESCE(es."housingType"::text, 'Non renseigné') AS housing_type,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY housing_type
ORDER BY housing_type;
```

### Taille du ménage

Visualization: Bar chart.

```sql
SELECT
  COALESCE(es."householdSize"::text, 'Non renseigné') AS household_size,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY household_size
ORDER BY household_size;
```

### Situation actuelle de logement

Visualization: Bar chart.

```sql
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
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY property_situation
ORDER BY simulations DESC;
```

### Situation professionnelle

Visualization: Bar chart.

```sql
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
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY employment_status
ORDER BY simulations DESC;
```

### Connaissance du BRS

Visualization: Donut or bar chart.

```sql
SELECT
  CASE
    WHEN es."hadBrsKnowledge" = true THEN 'Connaissait le BRS'
    WHEN es."hadBrsKnowledge" = false THEN 'Ne connaissait pas le BRS'
    ELSE 'Non renseigné'
  END AS brs_awareness,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
[[AND {{eligibility_zone}}]]
GROUP BY brs_awareness
ORDER BY simulations DESC;
```

### Zone d’éligibilité

Visualization: Bar chart.

```sql
SELECT
  CASE es."highestEligibilityZone"::text
    WHEN 'A_AND_ABIS' THEN 'A / Abis'
    WHEN 'B1' THEN 'B1'
    WHEN 'B2_AND_C' THEN 'B2 / C'
    WHEN 'NONE' THEN 'Non éligible'
    ELSE 'Non renseigné'
  END AS eligibility_zone,
  COUNT(DISTINCT es.id) AS simulations
FROM eligibility_simulation es
LEFT JOIN location l ON l."eligibilitySimulationId" = es.id
LEFT JOIN departement d ON d.id = l."departementId"
WHERE TRUE
[[AND {{submitted_at}}]]
[[AND {{departement_code}}]]
[[AND {{postal_code}}]]
GROUP BY eligibility_zone
ORDER BY simulations DESC;
```

## Suggested dashboard layout

1. Top row: total simulations, eligible simulations, contactable households.
2. Trend row: monthly simulations, conversion funnel.
3. Geography rows: France region color map, region bar chart, top departments, top postal codes.
4. Demand row: desired flat type, household size, revenue categories.
5. Profil des ménages : situation actuelle de logement, situation professionnelle, connaissance du BRS, zone d’éligibilité.

## Notes

- Prefer `resources` for revenue buckets if you want the user-declared household resources used by the simulator. Use `taxableIncome` if you specifically want revenu fiscal de référence; it may be missing depending on the step completed.
- Keep cards based on `COUNT(DISTINCT es.id)` unless the title explicitly says desired location/contact line.
- Metabase region maps only include world and US maps by default. For a France regional choropleth, add a custom GeoJSON map in Admin settings and make its identifier match `region.code`.
- If postal code filters are too granular for national views, expose department as the primary dashboard filter and keep postal code for drill-down use.
