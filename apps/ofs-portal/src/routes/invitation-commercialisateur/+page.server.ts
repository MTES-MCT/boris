import { env } from "$env/dynamic/private";
import { backendFetch, readJson } from "$lib/server/backend";
import {
  invitationError,
  type InvitationDetails,
} from "$lib/server/distributor-invitations";
import { fail, type Actions, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
  event.setHeaders({
    "cache-control": "no-store",
    "referrer-policy": "no-referrer",
  });
  const token = event.url.searchParams.get("token") || "";
  const response = await backendFetch(
    event,
    "/api/portal/distributor-invitations/inspect",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    },
  );
  return {
    token,
    invitation: response.ok
      ? await readJson<InvitationDetails>(response)
      : null,
    error: response.ok ? "" : await invitationError(response),
    supportEmail: env.SUPPORT_EMAIL || "arthur.massonneau.ext@beta.gouv.fr",
  };
};

export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const token = String(data.get("token") || "");
    const distributorId = String(data.get("distributorId") || "");
    const password = String(data.get("password") || "");
    const response = await backendFetch(
      event,
      "/api/portal/distributor-invitations/accept",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          ...(distributorId ? { distributorId } : {}),
          ...(password ? { password } : {}),
          createNew: data.get("createNew") === "on",
          reviewedMatchIds: data.getAll("reviewedMatchIds"),
        }),
      },
    );
    if (!response.ok) {
      // Refresh suggestions after a race with another invitation or account creation.
      const inspection = await backendFetch(
        event,
        "/api/portal/distributor-invitations/inspect",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        },
      );
      return fail(response.status, {
        error: await invitationError(response),
        invitation: inspection.ok
          ? await readJson<InvitationDetails>(inspection)
          : null,
      });
    }
    const result = await response.json();
    return {
      success: true,
      message: result.message as string,
      accountCreated: result.accountCreated as boolean,
    };
  },
};
