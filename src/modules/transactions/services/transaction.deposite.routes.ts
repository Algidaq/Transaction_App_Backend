import { Application } from 'express';
import { CommonRoutesConfig } from '../../../common/common.route.config';
import { TransactionDepositeController } from './transaction.deposite.controller';

export class TransactionDepositeRoutes extends CommonRoutesConfig<TransactionDepositeController> {
  configureRoutes(): Application {
    throw new Error('Method not implemented.');
  }
  get route(): string {
    return this.pathPrefix + '/transactions/deposite';
  }
}
