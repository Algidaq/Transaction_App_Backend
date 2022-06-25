import {
  Column,
  Entity,
  JoinColumn,
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

  @OneToOne(() => CustomerEntity, { nullable: false, eager: true })
  @JoinColumn()
  toCustomer!: CustomerEntity;

  @OneToOne(() => AccountEntity, { nullable: false, eager: true })
  @JoinColumn()
  toAccount!: AccountEntity;

  @Column({ name: 'balance_snapshot', type: 'float', nullable: false })
  balanceSnapshot!: number;
}
