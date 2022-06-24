import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/common.route.config';
import { CurrencyController } from './currency.controller';
import express from 'express';
import { RoleEntity } from '../role/role.entity';

export class CurrencyRoutes extends CommonRoutesConfig<CurrencyController> {
  constructor(
    app: express.Application,
    roles: RoleEntity[] = [],
    controller: CurrencyController = new CurrencyController()
  ) {
    super(app, 'CurrencyRole', controller, roles);
  }
  configureRoutes(): Application {
    this.app.route(this.route).get(this.controller.findAllResources);
    this.app.route(this.route + '/:id').get(this.controller.findSingleResource);
    this.app
      .route(this.route)
      .post(
        this.controller.validateCreationSchema,
        this.controller.addResource
      );
    return this.app;
  }
  get route(): string {
    return this.pathPrefix + '/currencies';
  }
}
