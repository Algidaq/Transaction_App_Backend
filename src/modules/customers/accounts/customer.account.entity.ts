import {
  Entity,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CurrencyEntity } from '../../currency/currency.entity';
import { CustomerEntity } from '../customer.entity';
@Entity({ name: 'accounts' })
export class AccountEntity {
  @Column({ name: 'id', generated: 'uuid' })
  id!: string;

  @Column({ name: 'balance', type: 'float', nullable: false, default: 0.0 })
  balance!: number;

  @ManyToOne(() => CurrencyEntity, {
    eager: true,
    nullable: false,
    cascade: false,
    onUpdate: 'NO ACTION',
  })
  @JoinColumn({ name: 'currencyId' })
  currency!: CurrencyEntity;

  @PrimaryColumn({ name: 'currencyId', select: true })
  currencyId!: number;

  @ManyToOne(() => CustomerEntity, (customer) => customer.accounts)
  @JoinColumn({ name: 'customerId' })
  customer!: CustomerEntity;

  @PrimaryColumn({ name: 'customerId', select: false })
  customerId!: string;

  @CreateDateColumn({ name: 'create_date' })
  createDate!: string;
  @UpdateDateColumn({ name: 'update_date' })
  updateDate!: string;
}
