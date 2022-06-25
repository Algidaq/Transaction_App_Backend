import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/common.route.config';
import express from 'express';
import { RoleEntity } from '../role/role.entity';
import { TransactionDepositeController } from './services/deposite/transaction.deposite.controller';
import { TransactionWithdrawController } from './services/withdraw/transaction.withdraw.controller';
import { TransactionLocalTransferController } from './services/local_transfer/transaction.local.transfer.controller';

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
    /**
     * With route transfer
     */
    const withdrawController = new TransactionWithdrawController();
    this.app
      .route(this.route + '/withdraw')
      .post(
        withdrawController.validateCreationSchema,
        withdrawController.validateIsCustomerAndFromAccountExists,
        withdrawController.makeTransactionDeposite
      );

    /**
     * locale route transfer
     */
    const localTransferController = new TransactionLocalTransferController();
    this.app
      .route(this.route + '/local-transfer')
      .post(
        localTransferController.validateCreationSchema,
        localTransferController.validateIsCustomerAndFromAccountExists,
        localTransferController.validateLocalTransferCreationSchema,
        localTransferController.validateIsToCustomerAndToAccountExists,
        localTransferController.handleAccountToAccountTransfer
      );
    return this.app;
  }
  get route(): string {
    return this.pathPrefix + '/transactions';
  }
}
