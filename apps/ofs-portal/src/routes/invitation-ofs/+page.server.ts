import { invitationError } from "$lib/server/invitations";
import { env } from "$env/dynamic/private";
import { backendFetch, readJson } from "$lib/server/backend";
import {
  fail,
  type Actions,
  type RequestEvent,
  type ServerLoad,
} from "@sveltejs/kit";

type Invitation = { email: string; ofsName: string; existingAccount: boolean };
const inspect = (event: RequestEvent, token: string) =>
  backendFetch(event, "/api/portal/ofs-invitations/inspect", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token }),
  });
export const load: ServerLoad = async (event) => {
  event.setHeaders({
    "cache-control": "no-store",
    "referrer-policy": "same-origin",
  });
  const token = event.url.searchParams.get("token") || "";
  const response = await inspect(event, token);
  return {
    token,
    invitation: response.ok ? await readJson<Invitation>(response) : null,
    error: response.ok ? "" : await invitationError(response),
    supportEmail: env.SUPPORT_EMAIL || "arthur.massonneau.ext@beta.gouv.fr",
  };
};
export const actions: Actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const token = String(data.get("token") || "");
    const password = String(data.get("password") || "");
    const firstName = String(data.get("firstName") || "");
    const lastName = String(data.get("lastName") || "");
    const response = await backendFetch(
      event,
      "/api/portal/ofs-invitations/accept",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          token,
          ...(password ? { password, firstName, lastName } : {}),
        }),
      },
    );
    if (!response.ok) {
      const inspection = await inspect(event, token);
      return fail(response.status, {
        error: await invitationError(response),
        invitation: inspection.ok
          ? await readJson<Invitation>(inspection)
          : null,
        firstName,
        lastName,
      });
    }
    return {
      success: true,
      message: (await response.json()).message as string,
    };
  },
};
