import { beforeEach, describe, expect, it, vi } from "vitest";
import { backendFetch } from "$lib/server/backend";
import { load } from "../../../../src/routes/(app)/ofs/[id]/simulations/+page.server";
import { GET } from "../../../../src/routes/(app)/ofs/[id]/simulations/export/+server";

vi.mock("$lib/server/backend", () => ({
  backendFetch: vi.fn(),
  readJson: (response: Response) => response.json(),
}));

beforeEach(() => vi.resetAllMocks());

describe("OFS contact filters", () => {
  it("forwards trimmed, encoded filters and pagination to the backend", async () => {
    vi.mocked(backendFetch)
      .mockResolvedValueOnce(Response.json({ id: "ofs-1", name: "OFS test" }))
      .mockResolvedValueOnce(Response.json({ items: [], totalCount: 0 }));
    const event = {
      params: { id: "ofs-1" },
      url: new URL(
        "http://portal.test/ofs/ofs-1/simulations?page=2&location=%20Lyon%20&contact=alice%2Btest%40example.test",
      ),
      parent: async () => ({ user: { canAccessAllOfss: true, ofss: [] } }),
    };
    const result = await load(event as unknown as Parameters<typeof load>[0]);

    expect(backendFetch).toHaveBeenLastCalledWith(
      event,
      "/api/portal/ofss/ofs-1/eligibility-simulations?page=2&pageSize=20&location=Lyon&contact=alice%2Btest%40example.test",
    );
    expect(result).toMatchObject({
      filters: { location: "Lyon", contact: "alice+test@example.test" },
    });
  });

  it("omits blank filters", async () => {
    vi.mocked(backendFetch)
      .mockResolvedValueOnce(Response.json({ id: "ofs-1", name: "OFS test" }))
      .mockResolvedValueOnce(Response.json({ items: [], totalCount: 0 }));
    const event = {
      params: { id: "ofs-1" },
      url: new URL("http://portal.test/ofs/ofs-1/simulations?location=%20"),
      parent: async () => ({ user: { canAccessAllOfss: true, ofss: [] } }),
    };
    await load(event as unknown as Parameters<typeof load>[0]);

    expect(backendFetch).toHaveBeenLastCalledWith(
      event,
      "/api/portal/ofss/ofs-1/eligibility-simulations?page=1&pageSize=20",
    );
  });

  it("forwards active filters and dates to CSV export", async () => {
    vi.mocked(backendFetch).mockResolvedValueOnce(
      new Response("date,contact\n", {
        headers: { "content-type": "text/csv; charset=utf-8" },
      }),
    );
    const query =
      "location=75&contact=mart&startDate=2026-01-01&endDate=2026-10-06";
    const event = {
      params: { id: "ofs-1" },
      url: new URL(`http://portal.test/ofs/ofs-1/simulations/export?${query}`),
    };
    const response = await GET(event as unknown as Parameters<typeof GET>[0]);

    expect(backendFetch).toHaveBeenCalledWith(
      event,
      `/api/portal/ofss/ofs-1/eligibility-simulations/export?${query}`,
    );
    expect(await response.text()).toBe("date,contact\n");
  });
});
