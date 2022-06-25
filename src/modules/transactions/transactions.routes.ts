import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/common.route.config';
import express from 'express';
import { RoleEntity } from '../role/role.entity';
import { TransactionDepositeController } from './services/transaction.deposite.controller';

export class TransactionRoutes extends CommonRoutesConfig<any> {
  constructor(app: express.Application, roles: RoleEntity[] = []) {
    super(app, 'TransactionsRoute', {}, roles);
  }
  configureRoutes(): Application {
    /**
     * Deposite route transfer
     */
    const depositeController = new TransactionDepositeController();
    this.app
      .route(this.route + '/deposite')
      .post(
        depositeController.validateCreationSchema,
        depositeController.validateIsCustomerAndFromAccountExists,
        depositeController.makeTransactionDeposite
      );
    return this.app;
  }
  get route(): string {
    return this.pathPrefix + '/transactions';
  }
}
