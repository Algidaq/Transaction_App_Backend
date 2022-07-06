import { CurrencyEntity } from '../currency/currency.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AccountEntity } from './accounts/customer.account.entity';

@Entity({ name: 'customers' })
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ name: 'full_name', type: 'varchar', nullable: false })
  fullName!: string;
  @Column({ name: 'phone', type: 'varchar', nullable: false, unique: true })
  phone!: string;

  @OneToMany(() => AccountEntity, (account) => account.customer, {
    eager: true,
    nullable: false,
    cascade: false,
    onUpdate: 'NO ACTION',
  })
  @JoinColumn()
  accounts!: AccountEntity[];

  @Column({
    name: 'is_removed',
    type: 'boolean',
    default: false,
    nullable: false,
  })
  isRemoved!: boolean;
  @CreateDateColumn({ name: 'create_date' })
  createDate!: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate!: string;
}
export interface IGetAccountEntity {
  id: string;
  balance: number;
  currency: CurrencyEntity;
}
