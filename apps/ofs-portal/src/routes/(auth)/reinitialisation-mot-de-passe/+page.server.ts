import { backendFetch } from "$lib/server/backend";
import { setFlash } from "$lib/server/flash";
import { fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ url }) => {
  return { token: url.searchParams.get("token") || "" };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const token = `${formData.get("token") || ""}`;
    const password = `${formData.get("password") || ""}`;

    const response = await backendFetch(
      event,
      "/api/portal/auth/reset-password",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      },
    );

    if (!response.ok) {
      return fail(400, {
        message: "Le lien de réinitialisation est invalide ou expiré.",
        token,
      });
    }

    setFlash(event.cookies, {
      type: "success",
      message: "Votre mot de passe a été réinitialisé.",
    });

    throw redirect(303, "/connexion?reset=success");
  },
};
