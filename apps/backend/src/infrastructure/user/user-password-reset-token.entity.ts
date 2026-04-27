import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_password_reset_token')
export class UserPasswordResetTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public tokenHash: string;

  @Column({ type: 'timestamp', nullable: false })
  public expiresAt: Date;

  @CreateDateColumn()
  public createdAt: Date;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  public user: UserEntity;

  @Column({ type: 'uuid', nullable: false, unique: true })
  public userId: string;

  constructor(tokenHash: string, expiresAt: Date, userId: string) {
    this.tokenHash = tokenHash;
    this.expiresAt = expiresAt;
    this.userId = userId;
  }
}
