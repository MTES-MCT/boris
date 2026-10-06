import { LeadNotificationEnqueuer } from '../ofs/notifications/lead-notification.enqueuer';
import { LeadNotificationOptions } from 'src/domain/ofs/lead-notification-options';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationRepositoryInterface } from 'src/domain/location/location.repository.interface';
import { LocationEntity } from './location.entity';

@Injectable()
export class LocationRepository implements LocationRepositoryInterface {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly repository: Repository<LocationEntity>,
    private readonly leadNotifications: LeadNotificationEnqueuer,
  ) {}

  public save(
    location: LocationEntity,
    options: LeadNotificationOptions = {},
  ): Promise<LocationEntity> {
    return this.repository.manager.transaction(async (manager) => {
      let simulationId: string | undefined = location.eligibilitySimulation?.id;
      if (
        !simulationId &&
        location.id &&
        location.eligibilitySimulation === undefined
      ) {
        const rows: { simulationId: string | null }[] = await manager.query(
          'SELECT "eligibilitySimulationId" AS "simulationId" FROM location WHERE id = $1',
          [location.id],
        );
        simulationId = rows[0]?.simulationId ?? undefined;
      }
      if (simulationId) {
        // Lock before inserting the location, consistently with simulation saves.
        await manager.query(
          'SELECT id FROM eligibility_simulation WHERE id = $1 FOR NO KEY UPDATE',
          [simulationId],
        );
      }
      const saved = await manager.save(LocationEntity, location);
      if (simulationId)
        await this.leadNotifications.enqueue(manager, simulationId, options);
      return saved;
    });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  public async findById(id: string): Promise<LocationEntity | null> {
    return this.repository.findOne({ where: { id } });
  }
}
