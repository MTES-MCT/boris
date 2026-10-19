import { backendFetch, readJson } from "$lib/server/backend";
import {
  invitationError,
  type DistributorInvitation,
  type DistributorSummary,
  type DistributorWithEmails,
} from "$lib/server/distributor-invitations";
import { fail, type Actions, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
  const ofs = await readJson<{
    id: string;
    name: string;
    distributors: DistributorSummary[];
  }>(await backendFetch(event, `/api/portal/ofss/${event.params.id}`));
  const invitations = await readJson<DistributorInvitation[]>(
    await backendFetch(
      event,
      `/api/portal/ofss/${event.params.id}/distributors/invitations`,
    ),
  );
  const distributors = await readJson<DistributorWithEmails[]>(
    await backendFetch(
      event,
      `/api/portal/ofss/${event.params.id}/distributors`,
    ),
  );
  return {
    ofs: { ...ofs, distributors },
    currentOfs: { id: ofs.id, name: ofs.name },
    invitations,
  };
};

export const actions: Actions = Object.fromEntries(
  ["link", "invite", "resend", "cancel"].map((action) => [
    action,
    async (event) => {
      const data = await event.request.formData();
      const name = String(data.get("name") || "");
      const email = String(data.get("email") || "");
      const id = encodeURIComponent(String(data.get("invitationId") || ""));
      const suffix =
        action === "link"
          ? "/link"
          : action === "invite"
            ? "/invitations"
            : `/invitations/${id}/${action}`;
      const response = await backendFetch(
        event,
        `/api/portal/ofss/${event.params.id}/distributors${suffix}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(
            action === "link"
              ? { distributorId: data.get("distributorId") }
              : action === "invite"
                ? { name, email }
                : {},
          ),
        },
      );
      if (!response.ok)
        return fail(response.status, {
          error: await invitationError(response),
          name,
          email,
        });
      const result = await response.json();
      return { message: result.message as string, name: "", email: "" };
    },
  ]),
);
