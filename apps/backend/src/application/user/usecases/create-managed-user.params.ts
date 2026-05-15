import { UserRole } from 'src/domain/user/user-role.enum';

export interface CreateManagedUserParams {
  email: string;
  role: UserRole;
  ofsIds?: string[];
}
