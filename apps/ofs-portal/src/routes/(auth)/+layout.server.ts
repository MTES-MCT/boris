import { env } from "$env/dynamic/private";
import { redirect, type ServerLoad } from "@sveltejs/kit";
import { getPortalUser, resolvePortalEntry } from "$lib/server/auth";

export const load: ServerLoad = async (event) => {
  const user = await getPortalUser(event);

  if (user) {
    throw redirect(303, resolvePortalEntry(user));
  }

  return {
    publicSiteUrl: env.PUBLIC_SITE_URL || "https://www.boris.beta.gouv.fr",
    supportEmail: env.SUPPORT_EMAIL || "arthur.massonneau.ext@beta.gouv.fr",
  };
};
