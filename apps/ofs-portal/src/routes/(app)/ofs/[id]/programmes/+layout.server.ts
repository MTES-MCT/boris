import { backendFetch, readJson } from "$lib/server/backend";
import { checkProgramAccess } from "$lib/server/programs";
import type { Program } from "$lib/programs";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  await event.parent();
  const response = await backendFetch(
    event,
    `/api/portal/ofss/${event.params.id}/programs`,
  );
  checkProgramAccess(response, event);
  const result = await readJson<{
    ofs: {
      id: string;
      name: string;
      distributors: { id: string; name: string }[];
    };
    programs: Program[];
  }>(response);
  return {
    ...result,
    currentOfs: { id: result.ofs.id, name: result.ofs.name },
  };
};
