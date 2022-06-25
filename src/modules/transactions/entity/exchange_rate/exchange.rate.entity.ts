import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CurrencyEntity } from '../../../currency/currency.entity';
import { ICreateExchangeRate } from '../../transactions.dto';

@Entity({ name: 'transaction_exchange_rate' })
export class TransactionExchangeRateEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @OneToOne(() => CurrencyEntity, { eager: true, nullable: false })
  @JoinColumn()
  fromCurrency!: CurrencyEntity;

  @OneToOne(() => CurrencyEntity, { eager: true, nullable: false })
  @JoinColumn()
  toCurrency!: CurrencyEntity;

  @Column({ name: 'rate', type: 'float', nullable: false, default: 1 })
  rate!: number;

  @Column({ name: 'exchanged_amount', type: 'float', nullable: false })
  exhangedAmount!: number;

  static createInstanceFormDto(
    dto: ICreateExchangeRate,
    amount: number
  ): TransactionExchangeRateEntity {
    const entity = new TransactionExchangeRateEntity();
    entity.fromCurrency = dto.fromCurrency;
    entity.toCurrency = dto.toCurrency;
    entity.rate = dto.rate;
    entity.exhangedAmount = amount * dto.rate;
    return entity;
  }
}
