import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerEntity } from '../../customers/customer.entity';
import { TransactionType } from '../types/transactions.types';
import { TransactionExchangeRateEntity } from './exchange_rate/exchange.rate.entity';
import { TransactionInfoEntity } from '../entity/transaction_info/transaction.info.entity';
import { LocalTransactionInfoEntity } from '../entity/local_transaction_info/local.transaction.info.entity';
import { AccountEntity } from '../../customers/accounts/customer.account.entity';

@Entity({ name: 'transactions' })
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @CreateDateColumn({ name: 'date' })
  date!: string;

  @ManyToOne(() => CustomerEntity, { eager: true, nullable: false })
  @JoinColumn()
  customer!: CustomerEntity;

  @ManyToOne(() => AccountEntity, { eager: true, nullable: false })
  @JoinColumn()
  fromAccount!: AccountEntity;

  @Column({ name: 'type' })
  type!: TransactionType;

  @Column({ name: 'amount', type: 'float', nullable: false })
  amount!: number;

  @Column({ name: 'balance_snapshot', type: 'float', nullable: false })
  balanceSnapShot!: number;

  @OneToOne(() => TransactionExchangeRateEntity, {
    eager: true,
    nullable: false,
    cascade: true,
  })
  @JoinColumn()
  exchangeRate!: TransactionExchangeRateEntity;

  @OneToOne(() => TransactionInfoEntity, { nullable: true, eager: true })
  @JoinColumn()
  transactionInfo!: TransactionInfoEntity | null;

  @OneToOne(() => LocalTransactionInfoEntity, { nullable: true, eager: true })
  @JoinColumn()
  localTransactionInfo!: LocalTransactionInfoEntity | null;

  @Column({ name: 'comment', nullable: false, type: 'varchar', default: 'N/A' })
  comment!: string;
}
