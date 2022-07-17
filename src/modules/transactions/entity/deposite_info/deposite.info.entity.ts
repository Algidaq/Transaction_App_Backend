import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'deposite_info' })
export class DepositeInfo {
  @PrimaryGeneratedColumn('increment')
  id!: number;
  @Column({ name: 'from', type: 'varchar', default: 'N/A', nullable: true })
  from!: string;
}
