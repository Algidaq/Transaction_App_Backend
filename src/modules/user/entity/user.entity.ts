import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from '../../role/role.entity';

@Entity({
  name: 'users',
})
@Unique(['id', 'phone'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({
    name: 'phone',
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false,
  })
  phone!: string;
  @Column({
    name: 'full_name',
    type: 'varchar',
    nullable: false,
    default: 'N/A',
  })
  fullName!: string;

  @Column({ name: 'password', type: 'text', nullable: false })
  password!: string;

  @ManyToOne(() => RoleEntity, {
    nullable: false,
    eager: true,
    lazy: false,
  })
  // @JoinColumn({ name: 'role_id' })
  role!: RoleEntity;
  @CreateDateColumn({ name: 'create_date' })
  createDate!: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate!: string;
}
