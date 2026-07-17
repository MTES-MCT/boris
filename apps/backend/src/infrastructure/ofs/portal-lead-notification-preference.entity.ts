import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { OfsEntity } from './ofs.entity';

export enum PortalLeadNotificationFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

@Entity('portal_lead_notification_preference')
@Unique('UQ_portal_lead_notification_preference_user_ofs', ['userId', 'ofsId'])
export class PortalLeadNotificationPreferenceEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'uuid' })
  public userId: string;

  @Column({ type: 'uuid' })
  public ofsId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: UserEntity;

  @ManyToOne(() => OfsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ofsId' })
  public ofs: OfsEntity;

  @Column({
    type: 'enum',
    enum: PortalLeadNotificationFrequency,
    nullable: false,
  })
  public frequency: PortalLeadNotificationFrequency;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
