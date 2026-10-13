import { error, fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { backendFetch } from "./backend";
import { setFlash } from "./flash";
import type { ProgramValues } from "$lib/programs";

export function checkProgramAccess(response: Response, event: RequestEvent) {
  if (response.status === 401) {
    throw redirect(
      303,
      `/connexion?returnTo=${encodeURIComponent(event.url.pathname)}`,
    );
  }
  if (response.status === 404 || response.status === 403) {
    throw error(404, "Ce programme ou cet OFS est introuvable.");
  }
}

export async function saveProgram(event: RequestEvent, editing = false) {
  const formData = await event.request.formData();
  const values: ProgramValues = {
    programName: String(formData.get("programName") || "").trim(),
    source: String(formData.get("source") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    inseeCode: String(formData.get("inseeCode") || "").trim(),
    deliveryMonth: String(formData.get("deliveryMonth") || ""),
    housingType: String(formData.get("housingType") || "new"),
    distributorId: String(formData.get("distributorId") || ""),
  };
  const response = await backendFetch(
    event,
    `/api/portal/ofss/${event.params.id}/programs${editing ? `/${event.params.programId}` : ""}`,
    {
      method: editing ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    },
  );
  checkProgramAccess(response, event);
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      response.status === 400 && typeof body?.message === "string"
        ? body.message
        : "L’enregistrement a échoué. Vérifiez les champs et réessayez.";
    return fail(response.status >= 500 ? 502 : 400, { error: message, values });
  }
  setFlash(event.cookies, {
    type: "success",
    message: editing
      ? "Le programme a été modifié."
      : "Le programme a été ajouté à la carte.",
  });
  throw redirect(303, `/ofs/${event.params.id}/programmes`);
}
