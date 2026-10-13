import { beforeEach, describe, expect, it, vi } from "vitest";
import { backendFetch } from "$lib/server/backend";
import { saveProgram } from "$lib/server/programs";
import { actions as deleteActions } from "../../../../src/routes/(app)/ofs/[id]/programmes/[programId]/supprimer/+page.server";
import { programValues } from "$lib/programs";

vi.mock("$lib/server/backend", () => ({ backendFetch: vi.fn() }));
vi.mock("$lib/server/flash", () => ({ setFlash: vi.fn() }));

beforeEach(() => vi.resetAllMocks());

function eventFor(fields: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return {
    params: { id: "selected-ofs", programId: "program-1" },
    url: new URL("http://portal.test/ofs/selected-ofs/programmes/nouveau"),
    cookies: {},
    request: new Request(
      "http://portal.test/ofs/selected-ofs/programmes/nouveau",
      { method: "POST", body: data },
    ),
  } as unknown as Parameters<typeof saveProgram>[0];
}

describe("Program form actions", () => {
  it("defaults new programs to new housing", () => {
    expect(programValues().housingType).toBe("new");
  });

  it("posts only editable fields for the selected OFS and redirects to its list", async () => {
    vi.mocked(backendFetch).mockResolvedValue(
      new Response("{}", { status: 201 }),
    );
    await expect(
      saveProgram(
        eventFor({
          programName: " Résidence ",
          source: "https://example.fr",
          address: "10 rue de Paris",
          city: "Paris",
          ofsId: "other-ofs",
          isDeleted: "true",
        }),
      ),
    ).rejects.toMatchObject({
      status: 303,
      location: "/ofs/selected-ofs/programmes",
    });
    const [, path, init] = vi.mocked(backendFetch).mock.calls[0];
    expect(path).toBe("/api/portal/ofss/selected-ofs/programs");
    expect(init?.method).toBe("POST");
    const body = JSON.parse(String(init?.body));
    expect(body).toMatchObject({
      programName: "Résidence",
      housingType: "new",
    });
    expect(body).not.toHaveProperty("ofsId");
    expect(body).not.toHaveProperty("isDeleted");
  });

  it("updates the selected program and allows clearing optional fields", async () => {
    vi.mocked(backendFetch).mockResolvedValue(new Response("{}"));
    await expect(
      saveProgram(
        eventFor({ housingType: "old", distributorId: "", deliveryMonth: "" }),
        true,
      ),
    ).rejects.toMatchObject({ status: 303 });
    const [, path, init] = vi.mocked(backendFetch).mock.calls[0];
    expect(path).toBe("/api/portal/ofss/selected-ofs/programs/program-1");
    expect(init?.method).toBe("PUT");
    expect(JSON.parse(String(init?.body))).toMatchObject({
      housingType: "old",
      distributorId: "",
      deliveryMonth: "",
    });
  });

  it("preserves values and displays geocoding failures", async () => {
    vi.mocked(backendFetch).mockResolvedValue(
      Response.json(
        { message: "Pas de résultat pour cette adresse." },
        { status: 400 },
      ),
    );
    const result = await saveProgram(
      eventFor({ programName: "Résidence", address: "Adresse inconnue" }),
    );
    expect(result.status).toBe(400);
    expect(result.data).toMatchObject({
      error: "Pas de résultat pour cette adresse.",
      values: { programName: "Résidence", address: "Adresse inconnue" },
    });
  });

  it.each([401, 404])(
    "handles access denial %s on mutations",
    async (status) => {
      vi.mocked(backendFetch).mockImplementation(
        async () => new Response(null, { status }),
      );
      await expect(saveProgram(eventFor())).rejects.toMatchObject({
        status: status === 401 ? 303 : 404,
      });
      await expect(
        deleteActions.default!(
          eventFor() as Parameters<
            NonNullable<typeof deleteActions.default>
          >[0],
        ),
      ).rejects.toMatchObject({ status: status === 401 ? 303 : 404 });
    },
  );

  it("deletes the program under the selected OFS only", async () => {
    vi.mocked(backendFetch).mockResolvedValue(new Response("{}"));
    await expect(
      deleteActions.default!(
        eventFor() as Parameters<NonNullable<typeof deleteActions.default>>[0],
      ),
    ).rejects.toMatchObject({
      status: 303,
      location: "/ofs/selected-ofs/programmes",
    });
    expect(backendFetch).toHaveBeenCalledWith(
      expect.anything(),
      "/api/portal/ofss/selected-ofs/programs/program-1",
      { method: "DELETE" },
    );
  });
});
