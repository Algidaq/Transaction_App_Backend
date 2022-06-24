import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'currencies' })
export class CurrencyEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column({
    name: 'name',
    unique: true,
    type: 'varchar',
    length: 56,
    nullable: false,
  })
  name!: string;
  @Column({
    name: 'symbol',
    unique: true,
    nullable: false,
    default: '$',
    type: 'varchar',
  })
  symbol!: string;

  @CreateDateColumn({ name: 'create_date' })
  createDate!: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate!: string;
}
