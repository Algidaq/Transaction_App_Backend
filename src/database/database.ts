import { DataSource } from 'typeorm';
import mysql2 from 'mysql2';
import { UserEntity } from '../modules/user/entity/user.entity';
import { RoleEntity } from '../modules/role/role.entity';
import { CurrencyEntity } from '../modules/currency/currency.entity';
import { TransactionEntity } from '../modules/transactions/entity/transaction.entity';
import { TransactionExchangeRateEntity } from '../modules/transactions/entity/exchange_rate/exchange.rate.entity';
import { LocalTransactionInfoEntity } from '../modules/transactions/entity/local_transaction_info/local.transaction.info.entity';
import { TransactionInfoEntity } from '../modules/transactions/entity/transaction_info/transaction.info.entity';
import { CustomerEntity } from '../modules/customers/customer.entity';
import { AccountEntity } from '../modules/customers/accounts/customer.account.entity';
const ApplicationDataSource = new DataSource({
  type: 'mysql',
  database: process.env.DB,
  port: Number.parseInt(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USER,
  host: process.env.HOST ?? 'localhost',
  password: process.env.DB_PASS ?? 'password',
  dateStrings: true,
  synchronize: true,
  cache: false,
  driver: mysql2,
  entities: [
    UserEntity,
    RoleEntity,
    CurrencyEntity,
    CustomerEntity,
    AccountEntity,
    TransactionEntity,
    TransactionExchangeRateEntity,
    TransactionInfoEntity,
    LocalTransactionInfoEntity,
  ],
});

export default ApplicationDataSource;
