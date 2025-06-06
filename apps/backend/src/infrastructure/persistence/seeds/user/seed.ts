import { Injectable } from '@nestjs/common';
import { SaveUserUseCase } from 'src/application/user/usecases/save.usecase';

@Injectable()
export class UserSeed {
  constructor(private readonly saveUserUsecase: SaveUserUseCase) {}

  async seed() {
    let usersCount = 0;

    try {
      await this.saveUserUsecase.execute({
        email: process.env.ADMIN_EMAIL as string,
        password: process.env.ADMIN_PASSWORD as string,
      });

      usersCount = usersCount + 1;

      console.log(`${usersCount} utilisateur(s) créé(s).`);
    } catch (e) {
      console.log(e);
    }
  }
}
