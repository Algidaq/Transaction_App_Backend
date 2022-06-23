import { DataSource } from 'typeorm';
import mysql2 from 'mysql2';
import { UserEntity } from '../modules/user/entity/user.entity';
import { RoleEntity } from '../modules/role/role.entity';
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
  entities: [UserEntity, RoleEntity],
});

export default ApplicationDataSource;
