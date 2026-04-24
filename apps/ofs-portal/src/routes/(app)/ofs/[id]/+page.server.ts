import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ params }) => {
  throw redirect(303, `/ofs/${params.id}/simulations`);
};
