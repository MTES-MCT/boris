import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OfsEntity } from '../ofs/ofs.entity';

@Entity('distributor_invitation')
@Index('UQ_distributor_invitation_pending', ['ofsId', 'email'], {
  unique: true,
  where: `"status" = 'pending'`,
})
export class DistributorInvitationEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) ofsId: string;
  @ManyToOne(() => OfsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ofsId' })
  ofs: OfsEntity;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'varchar', length: 254 }) email: string;
  @Column({ type: 'varchar', unique: true }) tokenHash: string;
  @Column({ type: 'varchar', default: 'pending' }) status:
    | 'pending'
    | 'accepted'
    | 'cancelled';
  @Column({ type: 'timestamptz' }) expiresAt: Date;
  @Column({ type: 'timestamptz', nullable: true }) acceptedAt: Date | null;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt: Date;
}
