export type DistributorSummary = { id: string; name: string };
export type DistributorWithEmails = DistributorSummary & { emails: string[] };
export type DistributorInvitation = {
  id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  expiresAt: string;
};
export type InvitationDetails = {
  name: string;
  email: string;
  ofsName: string;
  existingDistributor: DistributorSummary | null;
  matches: DistributorSummary[];
};

export async function invitationError(response: Response): Promise<string> {
  if (response.status === 429) return "Trop de demandes. Réessayez plus tard.";
  if (response.status >= 500 && response.status !== 503)
    return "L’opération a échoué. Réessayez dans quelques instants.";
  const body = await response.json().catch(() => null);
  return typeof body?.message === "string"
    ? body.message
    : "Vérifiez les informations saisies et réessayez.";
}
