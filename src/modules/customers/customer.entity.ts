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
    cascade: ['insert', 'update', 'remove'],
  })
  @JoinColumn()
  accounts!: AccountEntity[];

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
