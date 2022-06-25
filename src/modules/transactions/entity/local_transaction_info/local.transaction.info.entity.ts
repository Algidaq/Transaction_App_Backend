import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  CustomerEntity,
  AccountEntity,
} from '../../../customers/customer.entity';

@Entity({ name: 'local_transaction_info' })
export class LocalTransactionInfoEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => CustomerEntity, { nullable: false, eager: true })
  @JoinColumn()
  toCustomer!: CustomerEntity;

  @ManyToOne(() => AccountEntity, { nullable: false, eager: true })
  @JoinColumn()
  toAccount!: AccountEntity;

  @Column({ name: 'balance_snapshot', type: 'float', nullable: false })
  balanceSnapshot!: number;
}
