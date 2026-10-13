import { fail, redirect } from "@sveltejs/kit";
import { backendFetch } from "$lib/server/backend";
import { checkProgramAccess } from "$lib/server/programs";
import { setFlash } from "$lib/server/flash";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async (event) => {
    const response = await backendFetch(
      event,
      `/api/portal/ofss/${event.params.id}/programs/${event.params.programId}`,
      { method: "DELETE" },
    );
    checkProgramAccess(response, event);
    if (!response.ok)
      return fail(502, { error: "La suppression a échoué. Réessayez." });
    setFlash(event.cookies, {
      type: "success",
      message: "Le programme a été supprimé.",
    });
    throw redirect(303, `/ofs/${event.params.id}/programmes`);
  },
};
