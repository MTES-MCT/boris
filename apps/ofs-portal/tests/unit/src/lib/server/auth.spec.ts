import { describe, expect, it } from "vitest";
import { isSafePortalReturnTo, resolvePortalEntry } from "$lib/server/auth";

describe("portal auth helpers", () => {
  it("resolves admin users to the selection page", () => {
    expect(
      resolvePortalEntry({
        id: "1",
        email: "admin@example.com",
        roles: ["admin"],
        canAccessAllOfss: true,
        ofss: [],
      }),
    ).toBe("/selection-ofs");
  });

  it("resolves single-ofs users directly to their ofs page", () => {
    expect(
      resolvePortalEntry({
        id: "1",
        email: "ofs@example.com",
        roles: ["ofs"],
        canAccessAllOfss: false,
        ofss: [{ id: "ofs-1", name: "OFS 1" }],
      }),
    ).toBe("/ofs/ofs-1");
  });

  it("accepts only safe relative portal return targets", () => {
    expect(isSafePortalReturnTo("/ofs/123")).toBe(true);
    expect(isSafePortalReturnTo("https://example.com")).toBe(false);
    expect(isSafePortalReturnTo("//example.com")).toBe(false);
  });
});
