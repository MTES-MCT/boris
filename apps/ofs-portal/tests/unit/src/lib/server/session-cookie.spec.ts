import { describe, expect, it, vi } from "vitest";
import type { Cookies } from "@sveltejs/kit";
import { applyBackendSetCookie } from "$lib/server/session-cookie";

function cookieStore() {
  return {
    delete: vi.fn(),
    set: vi.fn(),
  } as unknown as Cookies;
}

describe("applyBackendSetCookie", () => {
  it("preserves security attributes on a host-only production cookie", () => {
    const cookies = cookieStore();

    applyBackendSetCookie(
      cookies,
      ["boris.sid=signed-value; Path=/; Secure; HttpOnly; SameSite=Strict"],
      new URL("https://portal.example.test/connexion"),
    );

    expect(cookies.set).toHaveBeenCalledWith(
      "boris.sid",
      "signed-value",
      expect.objectContaining({
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      }),
    );
  });

  it("rewrites cookie security attributes only on local HTTP", () => {
    const cookies = cookieStore();

    applyBackendSetCookie(
      cookies,
      [
        "boris.sid=signed-value; Domain=localhost; Path=/; Secure; HttpOnly; SameSite=Strict",
      ],
      new URL("http://localhost:5173/connexion"),
    );

    expect(cookies.set).toHaveBeenCalledWith(
      "boris.sid",
      "signed-value",
      expect.objectContaining({
        domain: undefined,
        sameSite: "lax",
        secure: false,
      }),
    );
  });

  it("preserves an explicit cookie domain on production HTTPS", () => {
    const cookies = cookieStore();

    applyBackendSetCookie(
      cookies,
      [
        "boris.sid=signed-value; Domain=.example.test; Path=/; Secure; HttpOnly; SameSite=Strict",
      ],
      new URL("https://portal.example.test/connexion"),
    );

    expect(cookies.set).toHaveBeenCalledWith(
      "boris.sid",
      "signed-value",
      expect.objectContaining({
        domain: ".example.test",
        sameSite: "strict",
        secure: true,
      }),
    );
  });

  it.each([
    "https://portal.example.test/connexion",
    "http://localhost:5173/connexion",
  ])("deletes expired cookies for %s", (requestUrl) => {
    const cookies = cookieStore();

    applyBackendSetCookie(
      cookies,
      ["boris.sid=; Path=/; Max-Age=0; Secure; SameSite=Strict"],
      new URL(requestUrl),
    );

    expect(cookies.delete).toHaveBeenCalledWith("boris.sid", {
      domain: undefined,
      path: "/",
    });
    expect(cookies.set).not.toHaveBeenCalled();
  });
});
