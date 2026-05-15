import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/domain/user/user-role.enum';

export class UserView {
  @ApiProperty({ example: '8f4d8096-c21a-4861-b1f7-72b11ef83417' })
  public id: string;

  @ApiProperty({ example: 'hello@whatsup.com' })
  public email: string;

  @ApiProperty({ enum: UserRole, isArray: true, example: [UserRole.ADMIN] })
  public roles: UserRole[];

  @ApiProperty({ example: true })
  public isActive: boolean;

  constructor(id: string, email: string, roles: UserRole[], isActive: boolean) {
    this.id = id;
    this.email = email;
    this.roles = roles;
    this.isActive = isActive;
  }
}
