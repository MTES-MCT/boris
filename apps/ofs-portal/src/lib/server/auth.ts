import { redirect, type RequestEvent } from "@sveltejs/kit";
import { backendFetch, readJson } from "./backend";

export type PortalUser = {
  id: string;
  email: string;
  roles: string[];
  canAccessAllOfss: boolean;
  ofss: { id: string; name: string }[];
};

export function isSafePortalReturnTo(
  value: string | null | undefined,
): value is string {
  return !!value && value.startsWith("/") && !value.startsWith("//");
}

export function resolvePortalEntry(user: PortalUser): string {
  if (user.canAccessAllOfss) {
    return "/selection-ofs";
  }

  if (user.ofss.length === 1) {
    return `/ofs/${user.ofss[0].id}`;
  }

  return "/selection-ofs";
}

export async function getPortalUser(
  event: RequestEvent,
): Promise<PortalUser | null> {
  try {
    const response = await backendFetch(event, "/api/portal/auth/me");

    if (response.status === 401 || response.status === 404) {
      return null;
    }

    return readJson<PortalUser>(response);
  } catch {
    return null;
  }
}

export function requirePortalUser(user: PortalUser | null, returnTo?: string) {
  if (!user) {
    const target =
      returnTo && isSafePortalReturnTo(returnTo)
        ? `?returnTo=${encodeURIComponent(returnTo)}`
        : "";
    throw redirect(303, `/connexion${target}`);
  }
}
