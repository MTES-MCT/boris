import type { PublicEligibilityStatistics } from '$lib/types/statistics';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const DEPARTEMENT_PATTERN = /^(?:\d{2,3}|2[AB])$/;
const POSTAL_CODE_PATTERN = /^[0-9A-Z]{2,5}$/;

export const load: PageServerLoad = async ({ fetch, url }) => {
  const requestedDepartement = url.searchParams.get('departement') ?? '';
  const departement = DEPARTEMENT_PATTERN.test(requestedDepartement)
    ? requestedDepartement
    : '';
  const requestedPostalCode = url.searchParams.get('codePostal') ?? '';
  const postalCode =
    departement && POSTAL_CODE_PATTERN.test(requestedPostalCode)
      ? requestedPostalCode
      : '';
  const query = new URLSearchParams();

  if (departement) query.set('departementCode', departement);
  if (postalCode) query.set('postalCode', postalCode);

  const response = await fetch(
    `/api/eligibility-simulations/public-statistics?${query.toString()}`,
    { cache: 'no-store' },
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw error(
        404,
        'Les statistiques ne sont pas publiées pour les périmètres de moins de 5 simulations',
      );
    }

    throw error(502, 'Impossible de charger les statistiques');
  }

  return {
    statistics: (await response.json()) as PublicEligibilityStatistics,
    selectedDepartement: departement,
    selectedPostalCode: postalCode,
  };
};
