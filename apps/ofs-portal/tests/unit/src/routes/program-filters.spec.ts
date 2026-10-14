import { describe, expect, it } from "vitest";
import { load } from "../../../../src/routes/(app)/ofs/[id]/programmes/+page.server";
import type { Program } from "$lib/programs";

const programs = [
  {
    id: "one",
    zipcode: "35000",
    city: "Rennes",
    distributor: { id: "coop", name: "Coopérative Habitat" },
  },
  { id: "two", zipcode: "35200", city: "Rennes", distributor: null },
  {
    id: "three",
    zipcode: "44000",
    city: "Nantes",
    distributor: { id: "coop", name: "Coopérative Habitat" },
  },
] as Program[];

async function filtered(query: string) {
  return await load({
    parent: async () => ({ programs }),
    url: new URL(`http://portal.test/ofs/selected-ofs/programmes?${query}`),
  } as Parameters<typeof load>[0]);
}

describe("Programme dashboard filters", () => {
  it("keeps all programmes including those without a commercialisateur by default", async () => {
    expect(await filtered("")).toMatchObject({ programs, totalPrograms: 3 });
  });

  it.each([
    ["zipcode=35", ["one", "two"]],
    ["city=REN", ["one", "two"]],
    ["distributor=cooperative", ["one", "three"]],
    ["zipcode=35000&city=rennes&distributor=habitat", ["one"]],
    ["zipcode=44000&city=rennes", []],
  ])("filters using %s", async (query, ids) => {
    const result = await filtered(query);
    expect(result?.programs.map((program: Program) => program.id)).toEqual(ids);
    expect(result?.totalPrograms).toBe(3);
  });

  it("trims whitespace and retains filter values for the form", async () => {
    expect(
      await filtered("city=%20Rennes%20&distributor=%20%20"),
    ).toMatchObject({
      filters: { zipcode: "", city: "Rennes", distributor: "" },
      programs: [programs[0], programs[1]],
    });
  });
});
