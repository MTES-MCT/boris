import { backendFetch } from "$lib/server/backend";
import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
  default: async (event) => {
    const formData = await event.request.formData();
    const email = `${formData.get("email") || ""}`;

    await backendFetch(event, "/api/portal/auth/forgot-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });

    return { submitted: true, email };
  },
};
