import { backendFetch, readJson } from "$lib/server/backend";
import { error, redirect, type ServerLoad } from "@sveltejs/kit";

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
  isNew: boolean;
};

type ContactPagination = {
  items: ContactLine[];
  totalCount: number;
  page: number;
  pageSize: number;
  pagesCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

type OfsSummary = {
  id: string;
  name: string;
};

export const load: ServerLoad = async (event) => {
  const { parent, params, url } = event;
  const { user } = await parent();
  const page = Number(url.searchParams.get("page") || "1");

  const ofsResponse = await backendFetch(
    event,
    `/api/portal/ofss/${params.id}`,
  );

  if (ofsResponse.status === 401) {
    throw redirect(
      303,
      `/connexion?returnTo=${encodeURIComponent(url.pathname + url.search)}`,
    );
  }

  if (ofsResponse.status === 404) {
    throw error(404, {
      message: "Cette page est introuvable.",
      backHref:
        user!.canAccessAllOfss || user!.ofss.length > 1
          ? "/selection-ofs"
          : "/",
    });
  }

  const ofs = await readJson<OfsSummary & Record<string, unknown>>(ofsResponse);
  const contactsResponse = await backendFetch(
    event,
    `/api/portal/ofss/${params.id}/eligibility-simulations?page=${page}&pageSize=20`,
  );

  const contacts = contactsResponse.ok
    ? await readJson<ContactPagination>(contactsResponse)
    : {
        items: [],
        totalCount: 0,
        page,
        pageSize: 20,
        pagesCount: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };

  return {
    ofs: { id: ofs.id, name: ofs.name },
    contacts,
    currentOfs: { id: ofs.id, name: ofs.name },
  };
};
