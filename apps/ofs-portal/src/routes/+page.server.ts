import { getPortalUser, resolvePortalEntry } from "$lib/server/auth";
import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
  const user = await getPortalUser(event);

  if (!user) {
    throw redirect(303, "/connexion");
  }

  throw redirect(303, resolvePortalEntry(user));
};
