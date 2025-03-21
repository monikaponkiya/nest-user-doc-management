import { UserRole } from 'src/common/constants/enum.constant';
import { TABLE_NAMES } from 'src/common/constants/table-name.constant';
import { Documents } from 'src/module/document/entity/document.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: TABLE_NAMES.USER })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Object.values(UserRole) })
  role: UserRole;

  @OneToMany(() => Documents, (document) => document.user)
  documents: Documents[];

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
