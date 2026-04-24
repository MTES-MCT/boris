import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from './session.entity';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
  ) {}

  public async destroyAllForUserId(userId: string): Promise<void> {
    const sessions = await this.sessionRepository
      .createQueryBuilder('session')
      .where('session.json LIKE :pattern', {
        pattern: `%"passport":{"user":"${userId}"}%`,
      })
      .getMany();

    if (sessions.length === 0) {
      return;
    }

    await this.sessionRepository.delete(sessions.map((session) => session.id));
  }
}
