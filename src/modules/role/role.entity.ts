import { UserEntity } from '../user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column({ name: 'role', type: 'varchar', nullable: false })
  role!: string;

  @CreateDateColumn({ name: 'create_date' })
  createDate!: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate!: string;
}
