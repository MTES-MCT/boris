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
