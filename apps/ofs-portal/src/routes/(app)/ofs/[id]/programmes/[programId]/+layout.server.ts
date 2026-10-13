import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ parent, params }) => {
  const { programs } = await parent();
  const program = programs.find((item) => item.id === params.programId);
  if (!program) throw error(404, "Ce programme est introuvable.");
  return { program };
};
