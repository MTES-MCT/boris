import { afterEach, describe, expect, it, vi } from "vitest";
import type { RequestEvent } from "@sveltejs/kit";
import { backendFetch } from "$lib/server/backend";

function requestEvent(): RequestEvent {
  return {
    request: new Request("http://portal.test/connexion", {
      headers: { "x-request-id": "portal-request-id" },
    }),
    route: { id: "/(auth)/connexion" },
    url: new URL("http://portal.test/connexion"),
    cookies: {
      delete: vi.fn(),
      set: vi.fn(),
    },
  } as unknown as RequestEvent;
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("backendFetch", () => {
  it("logs the backend response and correlates server errors", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Backend unavailable" }), {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "x-request-id": "backend-request-id" },
      }),
    );
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    vi.stubGlobal("fetch", fetchMock);

    await backendFetch(requestEvent(), "/api/portal/auth/me");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/api/portal/auth/me",
      expect.objectContaining({
        headers: expect.objectContaining({}),
      }),
    );
    const requestHeaders = fetchMock.mock.calls[0][1].headers as Headers;
    expect(requestHeaders.get("x-request-id")).toBe("portal-request-id");

    expect(consoleError).toHaveBeenCalledOnce();
    expect(JSON.parse(consoleError.mock.calls[0][0])).toEqual({
      marker: "OFS_PORTAL_BACKEND_ERROR",
      routeId: "/(auth)/connexion",
      portalPath: "/connexion",
      backendPath: "/api/portal/auth/me",
      method: "GET",
      status: 503,
      statusText: "Service Unavailable",
      requestId: "portal-request-id",
      backendRequestId: "backend-request-id",
      responseBody: JSON.stringify({ message: "Backend unavailable" }),
    });
  });
});
