import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { OfsEntity } from '../ofs/ofs.entity';

@Entity('portal_invitation')
@Index('UQ_portal_invitation_pending', ['ofsId', 'email', 'role'], {
  unique: true,
  where: `"status" = 'pending'`,
})
export class InvitationEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ type: 'uuid' }) ofsId: string;
  @ManyToOne(() => OfsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ofsId' })
  ofs: OfsEntity;
  @Column({ type: 'varchar', default: UserRole.DISTRIBUTOR })
  role: UserRole.OFS | UserRole.DISTRIBUTOR = UserRole.DISTRIBUTOR;
  @Column({ type: 'varchar', length: 200, default: '' }) name: string;
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
