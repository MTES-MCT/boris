import { backendFetch, readJson } from "$lib/server/backend";
import { setFlash } from "$lib/server/flash";
import { error, redirect, type Actions, type ServerLoad } from "@sveltejs/kit";

type OfsDetail = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  websiteUrl: string | null;
  updatedAt: string;
  regions: { id: string; name: string }[];
  departements: { id: string; name: string }[];
  distributors: { id: string; name: string }[];
};

export const load: ServerLoad = async (event) => {
  const { parent, params, url } = event;
  const { user } = await parent();

  const response = await backendFetch(event, `/api/portal/ofss/${params.id}`);

  if (response.status === 401) {
    throw redirect(
      303,
      `/connexion?returnTo=${encodeURIComponent(url.pathname)}`,
    );
  }

  if (response.status === 404) {
    throw error(404, {
      message: "Cette page est introuvable.",
      backHref:
        user!.canAccessAllOfss || user!.ofss.length > 1
          ? "/selection-ofs"
          : "/",
    });
  }

  const ofs = await readJson<OfsDetail>(response);

  return {
    ofs,
    currentOfs: { id: ofs.id, name: ofs.name },
  };
};

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const payload = {
      name: `${formData.get("name") || ""}`,
      email: `${formData.get("email") || ""}`,
      phone: `${formData.get("phone") || ""}`,
      websiteUrl: `${formData.get("websiteUrl") || ""}`,
    };

    const response = await backendFetch(
      event,
      `/api/portal/ofss/${event.params.id}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (response.status === 401) {
      throw redirect(
        303,
        `/connexion?returnTo=${encodeURIComponent(event.url.pathname)}`,
      );
    }

    if (!response.ok) {
      return {
        error: "La mise à jour a échoué. Vérifiez les informations saisies.",
        values: payload,
      };
    }

    setFlash(event.cookies, {
      type: "success",
      message: "Les informations de l’OFS ont été mises à jour.",
    });

    throw redirect(303, event.url.pathname);
  },
};
