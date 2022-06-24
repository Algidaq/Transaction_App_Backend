import { Application } from 'express';
import { CommonRoutesConfig } from '../../common/common.route.config';
import { RoleController } from './role.controller';
import express from 'express';
import { RoleEntity } from './role.entity';
export class RoleRoutes extends CommonRoutesConfig<RoleController> {
  constructor(app: express.Application, roles: RoleEntity[] = []) {
    super(app, 'RoleRoute', new RoleController());
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
    return this.pathPrefix + '/roles';
  }
}
