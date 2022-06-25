import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/common.route.config';
import { CustomerController } from './customer.controller';
import express from 'express';
import { RoleEntity } from '../role/role.entity';
export class CustomerRoutes extends CommonRoutesConfig<CustomerController> {
  constructor(app: express.Application, roles: RoleEntity[] = []) {
    super(app, 'Customers', new CustomerController(), roles);
  }
  configureRoutes(): Application {
    this.app.route(this.route).get(this.controller.findAllResources);
    this.app.route(this.route + ':/id').get(this.controller.findAllResources);
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
}
