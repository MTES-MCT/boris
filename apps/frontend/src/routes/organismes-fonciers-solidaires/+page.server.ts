import { redirect } from '@sveltejs/kit';

export const load = async () => {
  throw redirect(301, '/logements-brs-disponibles');
};
