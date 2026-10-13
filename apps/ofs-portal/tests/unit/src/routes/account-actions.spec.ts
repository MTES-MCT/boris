import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RequestEvent } from "@sveltejs/kit";
// @ts-expect-error SvelteKit's internal dispatcher has no published declarations.
import { handle_action_request } from "../../../../../../node_modules/@sveltejs/kit/src/runtime/server/page/actions.js";
import { actions } from "../../../../src/routes/(app)/mon-compte/+page.server";
import { backendFetch } from "$lib/server/backend";
import { getPortalUser } from "$lib/server/auth";
import { setFlash } from "$lib/server/flash";

vi.mock("$lib/server/backend", () => ({
  backendFetch: vi.fn(),
  readJson: vi.fn(),
}));
vi.mock("$lib/server/auth", () => ({
  getPortalUser: vi.fn(),
  requirePortalUser: vi.fn(),
}));
vi.mock("$lib/server/flash", () => ({ setFlash: vi.fn() }));

function submit(action: string, fields: [string, string][]) {
  const url = new URL(`http://portal.test/mon-compte?/${action}`);
  const event = {
    url,
    route: { id: "/(app)/mon-compte" },
    request: new Request(url, {
      method: "POST",
      body: new URLSearchParams(fields),
    }),
    cookies: { set: vi.fn() },
  } as unknown as RequestEvent;

  // Dispatch through SvelteKit so invalid combinations of form actions fail here
  // just as they do for the real page, before the backend request is sent.
  return handle_action_request(event, {} as never, { actions } as never);
}

beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(getPortalUser).mockResolvedValue({
    id: "user-1",
    email: "ofs@example.com",
    roles: ["ofs"],
    canAccessAllOfss: false,
    ofss: [{ id: "ofs-1", name: "OFS 1" }],
  });
  vi.mocked(backendFetch).mockResolvedValue(
    new Response(null, { status: 200 }),
  );
});

describe("account form actions", () => {
  it("dispatches notifications and saves every OFS preference", async () => {
    const result = await submit("notifications", [
      ["ofsId", "ofs-1"],
      ["frequency-ofs-1", "instant"],
      ["ofsId", "ofs-2"],
      ["frequency-ofs-2", "none"],
    ]);

    expect(result).toEqual({
      type: "redirect",
      status: 303,
      location: "/mon-compte",
    });
    expect(backendFetch).toHaveBeenCalledWith(
      expect.anything(),
      "/api/portal/lead-notifications",
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          notifications: [
            { ofsId: "ofs-1", frequency: "instant" },
            { ofsId: "ofs-2", frequency: "none" },
          ],
        }),
      },
    );
    expect(setFlash).toHaveBeenCalledWith(expect.anything(), {
      type: "success",
      message: "Vos préférences de notification ont été enregistrées.",
    });
  });

  it("dispatches password changes to their own action", async () => {
    const result = await submit("changePassword", [
      ["currentPassword", "current-password"],
      ["newPassword", "new-password-123"],
      ["newPasswordConfirmation", "new-password-123"],
    ]);

    expect(result).toEqual({
      type: "redirect",
      status: 303,
      location: "/mon-compte",
    });
    expect(backendFetch).toHaveBeenCalledWith(
      expect.anything(),
      "/api/portal/auth/change-password",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          currentPassword: "current-password",
          newPassword: "new-password-123",
        }),
      },
    );
  });

  it("shows a save error without claiming success when the backend fails", async () => {
    vi.mocked(backendFetch).mockResolvedValue(
      new Response(null, { status: 500 }),
    );

    const result = await submit("notifications", [
      ["ofsId", "ofs-1"],
      ["frequency-ofs-1", "daily"],
    ]);

    expect(result).toEqual({
      type: "failure",
      status: 400,
      data: {
        notificationMessage:
          "Les préférences de notification n'ont pas pu être enregistrées.",
      },
    });
    expect(setFlash).not.toHaveBeenCalled();
  });
});
