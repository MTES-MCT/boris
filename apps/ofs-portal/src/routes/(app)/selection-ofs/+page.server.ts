import { redirect, type ServerLoad } from "@sveltejs/kit";

export const load: ServerLoad = async ({ parent }) => {
  const { user, selectableOfss } = await parent();

  if (!user!.canAccessAllOfss && user!.ofss.length === 1) {
    throw redirect(303, `/ofs/${user!.ofss[0].id}`);
  }

  return {
    ofss: selectableOfss || [],
    currentOfs: null,
  };
};
