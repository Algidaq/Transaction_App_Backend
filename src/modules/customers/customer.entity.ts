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

@Entity({ name: 'accounts' })
/**
 *
 */
export class AccountEntity {
  @Column({ name: 'id', generated: 'uuid' })
  id!: string;

  @Column({ name: 'balance', type: 'float', nullable: false, default: 0.0 })
  balance!: number;

  @ManyToOne(() => CurrencyEntity, { eager: true, nullable: false })
  @JoinColumn({ name: 'currencyId' })
  currency!: CurrencyEntity;

  @PrimaryColumn({ name: 'currencyId', select: false })
  currencyId!: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.accounts)
  @JoinColumn({ name: 'customerId', referencedColumnName: 'id' })
  customer!: CustomerEntity;

  @PrimaryColumn({ name: 'customerId', select: false })
  customerId!: string;

  @CreateDateColumn({ name: 'create_date' })
  createDate!: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate!: string;
}
