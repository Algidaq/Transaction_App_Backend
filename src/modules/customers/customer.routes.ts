import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/common.route.config';
import { CustomerController } from './customer.controller';
import express from 'express';
import { RoleEntity } from '../role/role.entity';
import { entityExitsMiddleware } from '../../middlewares/entity.exits.middleware';
import { CustomerEntity } from './customer.entity';
import { CustomerDao } from './customer.dao';
import { CustomerAccountController } from './accounts/customer.account.controller';
export class CustomerRoutes extends CommonRoutesConfig<CustomerController> {
  constructor(app: express.Application, roles: RoleEntity[] = []) {
    super(app, 'Customers', new CustomerController(), roles);
  }
  configureRoutes(): Application {
    const customerDao = new CustomerDao();
    const accountController: CustomerAccountController =
      new CustomerAccountController();
    /**
     * get All accounts by specific customer
     */
    this.app
      .route(this.route + '/:id' + this.accountRoute + '/:accountId')
      .get(
        entityExitsMiddleware<CustomerDao>(customerDao),
        accountController.findSingleResource
      );
    this.app
      .route(this.route + '/:id' + this.accountRoute)
      .get(
        entityExitsMiddleware<CustomerDao>(customerDao),
        accountController.findAllResources
      );
    this.app
      .route(this.route + '/:id' + this.accountRoute)
      .post(
        entityExitsMiddleware<CustomerDao>(customerDao),
        accountController.validateCreationSchema,
        accountController.addResource
      );
    /**
     * Customer Routes
     */
    this.app.route(this.route + '/:id').get(this.controller.findSingleResource);
    this.app.route(this.route).get(this.controller.findAllResources);
    this.app
      .route(this.route)
      .post(
        this.controller.validateCreationSchema,
        this.controller.addResource
      );

    return this.app;
  }
  get route(): string {
    return this.pathPrefix + '/customers';
  }
  get accountRoute(): string {
    return '/accounts';
  }
}
