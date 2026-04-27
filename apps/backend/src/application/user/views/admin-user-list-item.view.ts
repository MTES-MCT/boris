import { UserRole } from 'src/domain/user/user-role.enum';

export class AdminUserListItemView {
  public id: string;
  public email: string;
  public roles: UserRole[];
  public isActive: boolean;
  public ofss: { id: string; name: string }[];
  public lastLoginAt: Date | null;

  constructor(
    id: string,
    email: string,
    roles: UserRole[],
    isActive: boolean,
    ofss: { id: string; name: string }[],
    lastLoginAt: Date | null,
  ) {
    this.id = id;
    this.email = email;
    this.roles = roles;
    this.isActive = isActive;
    this.ofss = ofss;
    this.lastLoginAt = lastLoginAt;
  }
}
