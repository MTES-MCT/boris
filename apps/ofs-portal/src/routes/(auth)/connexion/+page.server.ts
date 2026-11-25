import { backendFetch } from "$lib/server/backend";
import { isSafePortalReturnTo } from "$lib/server/auth";
import { fail, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ url }) => {
  return {
    returnTo: url.searchParams.get("returnTo") || "",
    resetSuccess: url.searchParams.get("reset") === "success",
    challengeExpired: url.searchParams.has("expired"),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const email = `${formData.get("email") || ""}`;
    const password = `${formData.get("password") || ""}`;
    const returnTo = `${formData.get("returnTo") || ""}`;

    const response = await backendFetch(event, "/api/portal/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let message = "Une erreur est survenue lors de la connexion.";

      if (response.status === 401) {
        message = "Identifiant ou mot de passe incorrect";
      } else if (response.status === 403) {
        const body = await response.json().catch(() => null);
        message =
          body?.message === "TWO_FACTOR_NOT_CONFIGURED"
            ? "La double authentification doit être configurée. Connectez-vous à l’espace OFS pour configurer votre application d’authentification."
            : "La connexion a été refusée. Vérifiez la configuration d'accès du portail.";
      } else if (response.status === 429) {
        message = "Trop de tentatives de connexion. Réessayez plus tard.";
      }

      return fail(400, {
        message,
        email,
        returnTo,
      });
    }

    if (response.status === 200) {
      const challenge = await response.json();
      const target = isSafePortalReturnTo(returnTo)
        ? `?returnTo=${encodeURIComponent(returnTo)}`
        : "";
      throw redirect(
        303,
        `${challenge.enrollmentRequired ? "/configuration-double-authentification" : "/double-authentification"}${target}`,
      );
    }

    throw redirect(303, isSafePortalReturnTo(returnTo) ? returnTo : "/");
  },
};
