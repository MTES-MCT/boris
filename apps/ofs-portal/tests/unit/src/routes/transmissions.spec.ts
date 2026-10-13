import { beforeEach, describe, expect, it, vi } from "vitest";
import { backendFetch } from "$lib/server/backend";
import { actions } from "../../../../src/routes/(app)/ofs/[id]/transmissions/+page.server";

vi.mock("$lib/server/backend", () => ({
  backendFetch: vi.fn(),
  readJson: (response: Response) => response.json(),
}));

beforeEach(() => vi.resetAllMocks());

function eventFor(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return {
    params: { id: "ofs-1" },
    request: new Request("http://portal.test/ofs/ofs-1/transmissions", {
      method: "POST",
      body: data,
    }),
  } as Parameters<NonNullable<typeof actions.update>>[0];
}

describe("Transmission form actions", () => {
  it.each([
    { inseeCodes: "75056, 69123; 2A004", departementCodes: "" },
    { inseeCodes: "", departementCodes: "75; 69 2A" },
    { inseeCodes: "75056", departementCodes: "69" },
  ])("updates a geographic scope: %j", async (codes) => {
    // The API rejects fields absent from UpdateCommercialTransmissionDto.
    vi.mocked(backendFetch).mockImplementation(async (_event, _path, init) => {
      const payload = JSON.parse(String(init?.body));
      return new Response(null, {
        status: "distributorId" in payload ? 400 : 200,
      });
    });
    const event = eventFor({
      transmissionId: "transmission-1",
      scopeType: "GEOGRAPHIC",
      isActive: "on",
      ...codes,
    });

    await expect(actions.update!(event)).rejects.toMatchObject({
      status: 303,
      location: "/ofs/ofs-1/transmissions",
    });
    const payload = JSON.parse(
      String(vi.mocked(backendFetch).mock.calls[0][2]?.body),
    );
    expect(payload).not.toHaveProperty("distributorId");
    expect(payload).toMatchObject({ scopeType: "GEOGRAPHIC", isActive: true });
    expect(payload.inseeCodes).toEqual(
      codes.inseeCodes.split(/[\s,;]+/).filter(Boolean),
    );
    expect(payload.departementCodes).toEqual(
      codes.departementCodes.split(/[\s,;]+/).filter(Boolean),
    );
  });

  it("keeps the commercialisateur in the create payload", async () => {
    vi.mocked(backendFetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );
    await expect(
      actions.create!(
        eventFor({
          distributorId: "distributor-1",
          scopeType: "ALL",
          isActive: "on",
        }),
      ),
    ).rejects.toMatchObject({ status: 303 });
    expect(
      JSON.parse(String(vi.mocked(backendFetch).mock.calls[0][2]?.body)),
    ).toEqual({
      distributorId: "distributor-1",
      scopeType: "ALL",
      isActive: true,
      inseeCodes: [],
      departementCodes: [],
    });
  });

  it("clears geographic codes and deactivates when requested", async () => {
    vi.mocked(backendFetch).mockResolvedValue(
      new Response(null, { status: 200 }),
    );
    await expect(
      actions.update!(
        eventFor({
          transmissionId: "transmission-1",
          scopeType: "ALL",
          inseeCodes: "75056",
          departementCodes: "75",
        }),
      ),
    ).rejects.toMatchObject({ status: 303 });
    expect(
      JSON.parse(String(vi.mocked(backendFetch).mock.calls[0][2]?.body)),
    ).toEqual({
      scopeType: "ALL",
      isActive: false,
      inseeCodes: [],
      departementCodes: [],
    });
  });
});
