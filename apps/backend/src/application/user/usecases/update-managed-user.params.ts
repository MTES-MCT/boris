import { UserRole } from 'src/domain/user/user-role.enum';

export interface UpdateManagedUserParams {
  actorUserId: string;
  userId: string;
  email: string;
  role: UserRole;
  ofsIds?: string[];
}
