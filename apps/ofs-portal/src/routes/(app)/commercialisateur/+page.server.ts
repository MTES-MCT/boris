import { backendFetch, readJson } from "$lib/server/backend";
import { redirect, type ServerLoad } from "@sveltejs/kit";

type ContactLine = {
  simulationId: string;
  locationId: string;
  submittedAt: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  departementCode: string | null;
  city: string | null;
  contribution: number | null;
  householdSize: number | null;
  hasDisability: boolean | null;
  taxableIncome: number | null;
  propertySituation: string | null;
  housingType: string | null;
  resources: number | null;
  action: string | null;
  status: string | null;
  isNew: boolean;
  transmittedDistributors: { id: string; name: string }[];
  ofs: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    websiteUrl: string | null;
  } | null;
};

export const load: ServerLoad = async (event) => {
  const { parent, url } = event;
  const parentData = await parent();
  const { user } = parentData;

  if (!user?.roles.includes("commercialisateur")) {
    throw redirect(303, "/");
  }

  const page = Number(url.searchParams.get("page") || "1");
  const ofsId = url.searchParams.get("ofsId") || "";
  const query = new URLSearchParams({ page: `${page}`, pageSize: "20" });

  if (ofsId) {
    query.set("ofsId", ofsId);
  }

  const contactsResponse = await backendFetch(
    event,
    `/api/portal/ofss/commercialisateur/eligibility-simulations?${query.toString()}`,
  );

  return {
    distributor: user.distributor,
    relationships: (parentData.distributorSelectableOfss || []).map(
      (ofs: { id: string; name: string }) => ({
        ofs,
      }),
    ),
    contacts: contactsResponse.ok
      ? await readJson<{
          items: ContactLine[];
          totalCount: number;
          page: number;
          pageSize: number;
          pagesCount: number;
          hasPreviousPage: boolean;
          hasNextPage: boolean;
        }>(contactsResponse)
      : {
          items: [],
          totalCount: 0,
          page,
          pageSize: 20,
          pagesCount: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        },
    selectedOfsId: ofsId,
  };
};
