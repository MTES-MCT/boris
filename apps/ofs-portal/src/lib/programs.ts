export type Program = {
  id: string;
  programName: string | null;
  source: string;
  address: string;
  city: string;
  zipcode: string;
  inseeCode: string;
  deliveryMonth: string | null;
  housingType: "new" | "old";
  distributor: { id: string; name: string } | null;
};

export type ProgramValues = {
  programName: string;
  source: string;
  address: string;
  city: string;
  inseeCode: string;
  deliveryMonth: string;
  housingType: string;
  distributorId: string;
};

export type ProgramFilters = {
  zipcode: string;
  city: string;
  distributor: string;
};

export function filterPrograms(programs: Program[], filters: ProgramFilters) {
  const normalize = (value: string) =>
    value
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const zipcode = normalize(filters.zipcode);
  const city = normalize(filters.city);
  const distributor = normalize(filters.distributor);

  return programs.filter(
    (program) =>
      normalize(program.zipcode).includes(zipcode) &&
      normalize(program.city).includes(city) &&
      normalize(program.distributor?.name || "").includes(distributor),
  );
}

export function programValues(program?: Program): ProgramValues {
  return {
    programName: program?.programName || "",
    source: program?.source || "",
    address: program?.address || "",
    city: program?.city || "",
    inseeCode: program?.inseeCode || "",
    deliveryMonth: program?.deliveryMonth || "",
    housingType: program?.housingType || "new",
    distributorId: program?.distributor?.id || "",
  };
}
