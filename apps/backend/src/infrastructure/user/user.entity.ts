import { UserInterface } from 'src/domain/user/user.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { OfsEntity } from '../ofs/ofs.entity';

@Entity('user')
export class UserEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public email: string;

  @Column({ type: 'varchar', nullable: false })
  public password: string;

  @Column({ type: 'enum', enum: UserRole, array: true, nullable: false })
  public roles: UserRole[];

  @Column({ type: 'boolean', nullable: false, default: true })
  public isActive: boolean;

  @ManyToMany(() => OfsEntity, (ofs) => ofs.users)
  @JoinTable({
    name: 'user_ofs',
  })
  public ofss: OfsEntity[];

  @Column({ type: 'timestamp', nullable: true })
  public lastLoginAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    email: string,
    password: string,
    roles: UserRole[] = [UserRole.ADMIN],
    isActive = true,
    ofss?: OfsEntity[],
  ) {
    this.email = email;
    this.password = password;
    this.roles = roles;
    this.isActive = isActive;

    if (ofss) {
      this.ofss = ofss;
    }

    this.lastLoginAt = null;
  }
}
