import { env } from "$env/dynamic/private";
import { error, type RequestEvent } from "@sveltejs/kit";
import { applyBackendSetCookie, clearSessionCookie } from "./session-cookie";

const BACKEND_API_URL = env.BACKEND_API_URL || "http://localhost:3000";
const OFS_PORTAL_URL = env.OFS_PORTAL_URL || "http://localhost:4173";

export async function backendFetch(
  event: RequestEvent,
  path: string,
  init: RequestInit = {},
) {
  const headers = new Headers(init.headers);
  const cookieHeader = event.request.headers.get("cookie");

  if (cookieHeader) {
    headers.set("cookie", cookieHeader);
  }

  headers.set("origin", OFS_PORTAL_URL);
  headers.set("referer", OFS_PORTAL_URL);

  const response = await fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers,
  });

  const setCookieHeaders =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : response.headers.get("set-cookie")
        ? [response.headers.get("set-cookie") as string]
        : [];

  applyBackendSetCookie(event.cookies, setCookieHeaders);

  if (response.status === 401) {
    clearSessionCookie(event.cookies);
  }

  return response;
}

export async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw error(response.status, "Backend request failed");
  }

  return (await response.json()) as T;
}
