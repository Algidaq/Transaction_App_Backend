import { DataSource } from 'typeorm';
import mysql2 from 'mysql2';
import { UserEntity } from '../modules/user/entity/user.entity';
import { RoleEntity } from '../modules/role/role.entity';
import { CurrencyEntity } from '../modules/currency/currency.entity';
import {
  CustomerEntity,
  AccountEntity,
} from '../modules/customers/customer.entity';
const ApplicationDataSource = new DataSource({
  type: 'mysql',
  database: process.env.DB,
  port: Number.parseInt(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USER,
  host: process.env.HOST ?? 'localhost',
  password: process.env.DB_PASS ?? 'password',
  dateStrings: true,
  synchronize: true,
  driver: mysql2,
  entities: [
    UserEntity,
    RoleEntity,
    CurrencyEntity,
    CustomerEntity,
    AccountEntity,
  ],
});

export default ApplicationDataSource;
