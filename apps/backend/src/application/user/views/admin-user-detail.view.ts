import { UserRole } from 'src/domain/user/user-role.enum';

export class AdminUserDetailView {
  public id: string;
  public email: string;
  public roles: UserRole[];
  public isActive: boolean;
  public ofss: { id: string; name: string }[];
  public distributor: { id: string; name: string } | null;
  public lastLoginAt: Date | null;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(
    id: string,
    email: string,
    roles: UserRole[],
    isActive: boolean,
    ofss: { id: string; name: string }[],
    distributor: { id: string; name: string } | null,
    lastLoginAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.roles = roles;
    this.isActive = isActive;
    this.ofss = ofss;
    this.distributor = distributor;
    this.lastLoginAt = lastLoginAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
