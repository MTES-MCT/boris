import { ApiProperty } from '@nestjs/swagger';

export class UserView {
  @ApiProperty({ example: 'hello@whatsup.com' })
  public email: string;

  constructor(email: string) {
    this.email = email;
  }
}
