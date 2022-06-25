import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CurrencyEntity } from '../../../currency/currency.entity';
import { ICreateExchangeRate } from '../../transactions.dto';

@Entity({ name: 'transaction_exchange_rate' })
export class TransactionExchangeRateEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @ManyToOne(() => CurrencyEntity, { eager: true, nullable: false })
  @JoinColumn()
  fromCurrency!: CurrencyEntity;

  @ManyToOne(() => CurrencyEntity, { eager: true, nullable: false })
  @JoinColumn()
  toCurrency!: CurrencyEntity;

  @Column({
    name: 'rate',
    type: 'float',
    nullable: false,
    default: 1,
    unique: false,
  })
  rate!: number;

  @Column({ name: 'exchanged_amount', type: 'float', nullable: false })
  exchangedAmount!: number;

  static createInstanceFormDto(
    dto: ICreateExchangeRate,
    amount: number
  ): TransactionExchangeRateEntity {
    const entity = new TransactionExchangeRateEntity();
    entity.fromCurrency = dto.fromCurrency;
    entity.toCurrency = dto.toCurrency;
    entity.rate = dto.rate;
    entity.exchangedAmount = amount * dto.rate;
    return entity;
  }
}
