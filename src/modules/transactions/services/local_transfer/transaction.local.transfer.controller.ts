import { ObjectSchema } from 'joi';
import { ITransactionController } from '../../base.transaction.controller';
import {
  TransactionLocalTransferService,
  ILocaleTransfer,
} from './transaction.local.transfer.service';
import Joi from 'joi';
import {
  IGetAccountDto,
  IGetCustomerDto,
} from '../../../customers/customer.dto';
import express from 'express';
import networkHandler from '../../../../utils/network.handler';
import { CustomerEntity } from '../../../customers/customer.entity';
import { AccountEntity } from '../../../customers/accounts/customer.account.entity';
import { Logger } from '../../../../utils/logger';

export class TransactionLocalTransferController extends ITransactionController<TransactionLocalTransferService> {
  constructor() {
    super(new TransactionLocalTransferService());
  }

  handleAccountToAccountTransfer = async (
    req: express.Request,
    res: express.Response
  ) => {
    const [customer, fromAccount, toCurrency] = this.getTransactionData(req);
    const toAccount: AccountEntity = (req as any).toAccount as AccountEntity;
    const toCustomer: CustomerEntity = (req as any)
      .toCustomer as CustomerEntity;
    try {
      const data: ILocaleTransfer = {
        body: req.body,
        customer: customer,
        fromAccount: fromAccount,
        toAccount: toAccount,
        toCustomer: toCustomer,
      };
      const _entity =
        await this.transactionService.handleAccountToAccountTransfer(data);

      const transaction =
        await this.transactionService.transactionDao.findSingleResource({
          where: { id: _entity.id },
        });
      return res.json(transaction);
    } catch (e) {
      Logger.error(e);
      return networkHandler.serverError(res, 'Error Occured');
    }
  };

  get localTransferSchema(): ObjectSchema<any> {
    return Joi.object({
      toCustomer: Joi.object<IGetCustomerDto>({
        id: Joi.string().uuid().required(),
        fullName: Joi.string(),
        accounts: Joi.array(),
        phone: Joi.string(),
        updateDate: Joi.string(),
      }).required(),
      toAccount: Joi.object<IGetAccountDto>({
        id: Joi.string().required(),
        currency: Joi.object(),
        balance: Joi.number(),
        createDate: Joi.string(),
        updateDate: Joi.string(),
      }).required(),
    }).unknown();
  }
  validateLocalTransferCreationSchema = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): express.Response | void => {
    const { error } = this.localTransferSchema.validate(req.body);
    if (!error) return next();
    return networkHandler.badRequest(res, error?.message ?? 'N/A');
  };

  validateIsToCustomerAndToAccountExists = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const customerId: string = req.body.toCustomer.id ?? 'N/A';
    const customer = await this.customerService.getCustomer({ id: customerId });

    if (!customer) {
      networkHandler.entityNotFound(res, 'toCustomer', customerId);
      return;
    }
    const fromAccountId: string = req.body.toAccount.id ?? 'N/A';

    const account = await this.accountService.getAccountById(fromAccountId);
    if (!account) {
      networkHandler.entityNotFound(res, 'toAccount', fromAccountId);
      return;
    }
    const fromCustomer: CustomerEntity = (req as any).customer;
    const fromAccount: AccountEntity = (req as any).fromAccount;
    if (fromCustomer.id === customer.id && fromAccount.id === account.id) {
      networkHandler.badRequest(
        res,
        'Cannot transfer to same with the same accounts'
      );
    }

    (req as any).toCustomer = customer;
    (req as any).toAccount = account;

    next();
  };
}
