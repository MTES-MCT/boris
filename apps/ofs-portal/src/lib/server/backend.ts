import { env } from "$env/dynamic/private";
import { error, type RequestEvent } from "@sveltejs/kit";
import { applyBackendSetCookie, clearSessionCookie } from "./session-cookie";

const BACKEND_API_URL = env.BACKEND_API_URL || "http://localhost:3001";
const OFS_PORTAL_URL = env.OFS_PORTAL_URL || "http://localhost:5173";

async function logBackendError(
  event: RequestEvent,
  path: string,
  method: string,
  response: Response,
) {
  let responseBody: string;

  try {
    responseBody = await response.clone().text();
  } catch (error) {
    responseBody = `Unable to read backend response: ${String(error)}`;
  }

  console.error(
    JSON.stringify({
      marker: "OFS_PORTAL_BACKEND_ERROR",
      routeId: event.route.id,
      portalPath: event.url.pathname,
      backendPath: path,
      method,
      status: response.status,
      statusText: response.statusText,
      requestId: event.request.headers.get("x-request-id"),
      backendRequestId: response.headers.get("x-request-id"),
      responseBody,
    }),
  );
}

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

  const requestId = event.request.headers.get("x-request-id");

  if (requestId) {
    headers.set("x-request-id", requestId);
  }

  headers.set("origin", OFS_PORTAL_URL);
  headers.set("referer", OFS_PORTAL_URL);

  const method = init.method || "GET";

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

  if (response.status >= 500) {
    await logBackendError(event, path, method, response);
  }

  return response;
}

export async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw error(response.status, "Backend request failed");
  }

  return (await response.json()) as T;
}
