export class PortalContactLineView {
  public simulationId: string;
  public locationId: string;
  public submittedAt: Date;
  public fullName: string | null;
  public email: string | null;
  public phone: string | null;
  public departementCode: string | null;
  public city: string | null;
  public contribution: number | null;
  public householdSize: number | null;
  public hasDisability: boolean | null;
  public taxableIncome: number | null;
  public propertySituation: string | null;
  public housingType: string | null;
  public resources: number | null;
  public action: string | null;
  public status: string | null;
  public isNew: boolean;
  public transmittedDistributors: { id: string; name: string }[];
  public ofs: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    websiteUrl: string | null;
  } | null;

  constructor(props: PortalContactLineView) {
    this.simulationId = props.simulationId;
    this.locationId = props.locationId;
    this.submittedAt = props.submittedAt;
    this.fullName = props.fullName;
    this.email = props.email;
    this.phone = props.phone;
    this.departementCode = props.departementCode;
    this.city = props.city;
    this.contribution = props.contribution;
    this.householdSize = props.householdSize;
    this.hasDisability = props.hasDisability;
    this.taxableIncome = props.taxableIncome;
    this.propertySituation = props.propertySituation;
    this.housingType = props.housingType;
    this.resources = props.resources;
    this.action = props.action;
    this.status = props.status;
    this.isNew = props.isNew;
    this.transmittedDistributors = props.transmittedDistributors || [];
    this.ofs = props.ofs || null;
  }
}
