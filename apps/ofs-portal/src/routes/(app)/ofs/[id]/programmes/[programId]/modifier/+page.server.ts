import { saveProgram } from "$lib/server/programs";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: (event) => saveProgram(event, true),
};
