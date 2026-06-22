import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { OfsEntity } from './ofs.entity';

@Entity('ofs_embed_origin')
@Unique('UQ_ofs_embed_origin_origin', ['origin'])
export class OfsEmbedOriginEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'uuid' })
  @Index('IDX_ofs_embed_origin_ofs')
  public ofsId: string;

  @ManyToOne(() => OfsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ofsId' })
  public ofs: OfsEntity;

  @Column({ type: 'varchar' })
  public origin: string;

  @Column({ type: 'boolean', default: true })
  public enabled: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
