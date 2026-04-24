import { backendFetch, readJson } from "$lib/server/backend";
import { getPortalUser, requirePortalUser } from "$lib/server/auth";
import type { ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
  const user = await getPortalUser(event);
  requirePortalUser(user, `${event.url.pathname}${event.url.search}`);
  const authenticatedUser = user!;

  let selectableOfss: App.PageData["selectableOfss"] = [];

  if (authenticatedUser.canAccessAllOfss || authenticatedUser.ofss.length > 1) {
    const response = await backendFetch(event, "/api/portal/ofss");
    selectableOfss = response.ok ? await readJson(response) : [];
  }

  return {
    user: authenticatedUser,
    selectableOfss,
    isAuthenticatedApp: true,
  };
};
