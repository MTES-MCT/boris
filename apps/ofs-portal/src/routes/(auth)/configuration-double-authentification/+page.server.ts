import { backendFetch, readJson } from "$lib/server/backend";
import { isSafePortalReturnTo } from "$lib/server/auth";
import {
  fail,
  redirect,
  type Actions,
  type ServerLoad,
  type RequestEvent,
} from "@sveltejs/kit";
import QRCode from "qrcode";

type Enrollment = {
  enabled: boolean;
  email: string;
  secret: string | null;
  uri: string | null;
};
const endpoint = "/api/portal/auth/two-factor/enrollment";
const options = { preserveSessionOnUnauthorized: true };

async function status(event: RequestEvent) {
  const response = await backendFetch(event, endpoint, {}, options);
  if (response.status === 401) throw redirect(303, "/connexion?expired=1");
  return readJson<Enrollment>(response);
}

export const load: ServerLoad = async (event) => {
  event.setHeaders({ "cache-control": "no-store" });
  const enrollment = await status(event);
  return {
    ...enrollment,
    qrCode: enrollment.uri
      ? await QRCode.toDataURL(enrollment.uri, {
          width: 256,
          margin: 4,
          errorCorrectionLevel: "M",
        })
      : null,
    returnTo: event.url.searchParams.get("returnTo") || "/mon-compte",
  };
};

export const actions: Actions = {
  begin: async (event) => {
    const data = await event.request.formData();
    const response = await backendFetch(
      event,
      endpoint,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          currentPassword: String(data.get("currentPassword") || ""),
        }),
      },
      options,
    );
    if (!response.ok)
      return fail(response.status, {
        message:
          response.status === 429
            ? "Trop de tentatives. Réessayez dans 15 minutes."
            : "Impossible de démarrer la configuration. Vérifiez votre mot de passe ou reconnectez-vous.",
      });
    // Redirect so the secret is loaded from the pending server session on reload.
    throw redirect(303, `${event.url.pathname}${event.url.search}`);
  },
  confirm: async (event) => {
    const data = await event.request.formData();
    const response = await backendFetch(
      event,
      `${endpoint}/confirm`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: String(data.get("code") || "") }),
      },
      options,
    );
    if (response.status === 401) throw redirect(303, "/connexion?expired=1");
    if (!response.ok) {
      const body = await response.json().catch(() => null);
      return fail(response.status, {
        message:
          response.status === 429
            ? "Trop de tentatives. Réessayez dans 15 minutes."
            : body?.message === "TWO_FACTOR_ENROLLMENT_EXPIRED"
              ? "La configuration a expiré. Recommencez avec une nouvelle clé."
              : "Code invalide. Saisissez le code à 6 chiffres de votre application.",
      });
    }
    return {
      recoveryCodes: (await readJson<{ recoveryCodes: string[] }>(response))
        .recoveryCodes,
    };
  },
  cancel: async (event) => {
    await backendFetch(
      event,
      `${endpoint}/cancel`,
      { method: "POST" },
      options,
    );
    throw redirect(303, "/mon-compte");
  },
  finish: async (event) => {
    const data = await event.request.formData();
    const returnTo = String(data.get("returnTo") || "");
    throw redirect(
      303,
      isSafePortalReturnTo(returnTo) &&
        !returnTo.startsWith("/configuration-double-authentification")
        ? returnTo
        : "/mon-compte",
    );
  },
};
