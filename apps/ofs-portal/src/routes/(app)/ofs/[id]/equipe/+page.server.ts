import {
  invitationError,
  type PortalInvitation,
} from "$lib/server/invitations";
import { env } from "$env/dynamic/private";
import { backendFetch, readJson } from "$lib/server/backend";
import { fail, type Actions, type ServerLoad } from "@sveltejs/kit";

type Member = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
};
export const load: ServerLoad = async (event) => {
  const [ofsResponse, teamResponse] = await Promise.all([
    backendFetch(event, `/api/portal/ofss/${event.params.id}`),
    backendFetch(event, `/api/portal/ofss/${event.params.id}/members`),
  ]);
  const ofs = await readJson<{ id: string; name: string }>(ofsResponse);
  const team = await readJson<{
    members: Member[];
    invitations: PortalInvitation[];
  }>(teamResponse);
  return {
    ...team,
    currentOfs: { id: ofs.id, name: ofs.name },
    supportEmail: env.SUPPORT_EMAIL || "arthur.massonneau.ext@beta.gouv.fr",
  };
};
export const actions: Actions = Object.fromEntries(
  ["invite", "resend", "cancel"].map((action) => [
    action,
    async (event) => {
      const data = await event.request.formData();
      const email = String(data.get("email") || "");
      const id = encodeURIComponent(String(data.get("invitationId") || ""));
      const suffix = action === "invite" ? "" : `/${id}/${action}`;
      const response = await backendFetch(
        event,
        `/api/portal/ofss/${event.params.id}/members/invitations${suffix}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(action === "invite" ? { email } : {}),
        },
      );
      if (!response.ok)
        return fail(response.status, {
          error: await invitationError(response),
          email,
        });
      return { message: (await response.json()).message as string, email: "" };
    },
  ]),
);
