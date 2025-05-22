import { UserInterface } from 'src/domain/user/user.interface';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  public email: string;

  @Column({ type: 'varchar', nullable: false })
  public password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
