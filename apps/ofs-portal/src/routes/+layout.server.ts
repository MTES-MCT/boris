import type { ServerLoad } from "@sveltejs/kit";
import { readFlash } from "$lib/server/flash";

export const load: ServerLoad = async ({ cookies }) => {
  return {
    flash: readFlash(cookies),
  };
};
