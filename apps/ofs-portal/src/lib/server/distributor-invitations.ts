import type { PortalInvitation } from "./invitations";

export type DistributorSummary = { id: string; name: string };
export type DistributorWithEmails = DistributorSummary & { emails: string[] };
export type DistributorInvitation = PortalInvitation & { name: string };
export type InvitationDetails = {
  name: string;
  email: string;
  ofsName: string;
  existingDistributor: DistributorSummary | null;
  matches: DistributorSummary[];
};
