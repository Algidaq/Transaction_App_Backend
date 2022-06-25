import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'transaction_info' })
export class TransactionInfoEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column({ name: 'full_name', type: 'varchar', nullable: false })
  fullName!: string;
  @Column({
    name: 'phone',
    type: 'varchar',
    length: 56,
    default: 'N/A',
    nullable: false,
  })
  phone!: string;

  @Column({
    name: 'bank_account',
    type: 'varchar',
    default: 'N/A',
    nullable: false,
  })
  bankAccount!: string;
}
