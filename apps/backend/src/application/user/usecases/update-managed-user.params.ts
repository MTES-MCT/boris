export interface UpdateManagedUserParams {
  actorUserId: string;
  userId: string;
  email: string;
  role: string;
  ofsIds?: string[];
}
