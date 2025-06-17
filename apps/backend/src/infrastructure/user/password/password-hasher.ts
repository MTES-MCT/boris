import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';

@Injectable()
export class PasswordHasher implements PasswordHasherInterface {
  async hash(password: string): Promise<string> {
    return await hash(password, 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
