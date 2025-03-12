import { TABLE_NAMES } from 'src/common/constants/table-name.constant';
import { Users } from 'src/module/users/entity/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: TABLE_NAMES.DOCUMENT })
export class Documents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  path: string;

  @Column({ type: 'bigint', nullable: false })
  size: number;

  @Column({ nullable: false })
  mimeType: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Users, (user) => user.documents, { onDelete: 'CASCADE' })
  user: Users;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date;
}
