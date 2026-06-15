import { backendFetch, readJson } from "$lib/server/backend";
import {
  error,
  fail,
  redirect,
  type Actions,
  type ServerLoad,
} from "@sveltejs/kit";

type Transmission = {
  id: string;
  distributor: { id: string; name: string };
  isActive: boolean;
  scopeType: "ALL" | "GEOGRAPHIC";
  inseeCodes: string[];
  departementCodes: string[];
};

type OfsDetail = {
  id: string;
  name: string;
  distributors: { id: string; name: string }[];
};

export const load: ServerLoad = async (event) => {
  const { parent, params, url } = event;
  const { user } = await parent();
  const ofsResponse = await backendFetch(
    event,
    `/api/portal/ofss/${params.id}`,
  );

  if (ofsResponse.status === 401) {
    throw redirect(
      303,
      `/connexion?returnTo=${encodeURIComponent(url.pathname + url.search)}`,
    );
  }

  if (ofsResponse.status === 404) {
    throw error(404, {
      message: "Cette page est introuvable.",
      backHref:
        user!.canAccessAllOfss || user!.ofss.length > 1
          ? "/selection-ofs"
          : "/",
    });
  }

  const ofs = await readJson<OfsDetail>(ofsResponse);
  const transmissionsResponse = await backendFetch(
    event,
    `/api/portal/ofss/${params.id}/commercial-transmissions`,
  );

  return {
    ofs,
    currentOfs: { id: ofs.id, name: ofs.name },
    transmissions: transmissionsResponse.ok
      ? await readJson<Transmission[]>(transmissionsResponse)
      : [],
    distributors: ofs.distributors,
  };
};

const splitCodes = (value: FormDataEntryValue | null) =>
  String(value || "")
    .split(/[\s,;]+/)
    .map((code) => code.trim())
    .filter(Boolean);

function payloadFromForm(data: FormData) {
  const scopeType =
    data.get("scopeType") === "GEOGRAPHIC" ? "GEOGRAPHIC" : "ALL";

  return {
    distributorId: String(data.get("distributorId") || ""),
    isActive: data.get("isActive") === "on",
    scopeType,
    inseeCodes:
      scopeType === "GEOGRAPHIC" ? splitCodes(data.get("inseeCodes")) : [],
    departementCodes:
      scopeType === "GEOGRAPHIC"
        ? splitCodes(data.get("departementCodes"))
        : [],
  };
}

export const actions: Actions = {
  create: async (event) => {
    const data = await event.request.formData();
    const response = await backendFetch(
      event,
      `/api/portal/ofss/${event.params.id}/commercial-transmissions`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payloadFromForm(data)),
      },
    );

    if (!response.ok) {
      return fail(400, { error: "La transmission n'a pas pu être créée." });
    }

    throw redirect(303, `/ofs/${event.params.id}/transmissions`);
  },

  update: async (event) => {
    const data = await event.request.formData();
    const transmissionId = String(data.get("transmissionId") || "");
    const response = await backendFetch(
      event,
      `/api/portal/ofss/${event.params.id}/commercial-transmissions/${transmissionId}`,
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payloadFromForm(data)),
      },
    );

    if (!response.ok) {
      return fail(400, {
        error: "La transmission n'a pas pu être mise à jour.",
      });
    }

    throw redirect(303, `/ofs/${event.params.id}/transmissions`);
  },
};
