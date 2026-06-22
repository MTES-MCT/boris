import { backendFetch } from "$lib/server/backend";
import { getPortalUser, requirePortalUser } from "$lib/server/auth";
import { setFlash } from "$lib/server/flash";
import { fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async (event) => {
  const user = await getPortalUser(event);
  requirePortalUser(user, `${event.url.pathname}${event.url.search}`);

  return {
    accountEmail: user!.email,
  };
};

export const actions: Actions = {
  default: async (event) => {
    const user = await getPortalUser(event);
    requirePortalUser(user, `${event.url.pathname}${event.url.search}`);

    const formData = await event.request.formData();
    const currentPassword = `${formData.get("currentPassword") || ""}`;
    const newPassword = `${formData.get("newPassword") || ""}`;
    const newPasswordConfirmation = `${formData.get("newPasswordConfirmation") || ""}`;

    if (newPassword !== newPasswordConfirmation) {
      return fail(400, {
        message: "Les deux nouveaux mots de passe ne correspondent pas.",
      });
    }

    if (newPassword.length < 12) {
      return fail(400, {
        message: "Le nouveau mot de passe doit contenir au moins 12 caractères.",
      });
    }

    const response = await backendFetch(
      event,
      "/api/portal/auth/change-password",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );

    if (!response.ok) {
      return fail(400, {
        message: "Le mot de passe actuel est incorrect.",
      });
    }

    setFlash(event.cookies, {
      type: "success",
      message: "Votre mot de passe a été modifié.",
    });

    throw redirect(303, "/mon-compte");
  },
};
