import { filterPrograms } from "$lib/programs";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, url }) => {
  const { programs } = await parent();
  const filters = {
    zipcode: url.searchParams.get("zipcode")?.trim() || "",
    city: url.searchParams.get("city")?.trim() || "",
    distributor: url.searchParams.get("distributor")?.trim() || "",
  };
  return {
    programs: filterPrograms(programs, filters),
    totalPrograms: programs.length,
    filters,
  };
};
