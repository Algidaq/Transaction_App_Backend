import { Application } from 'express';
import { CommonRoutesConfig } from '../../../common/common.route.config';
import express from 'express';
import { UserController } from '../controller/user.controller';
import { AuthorizationMiddleware } from '../../../middlewares/authorization.middleware';
import { RoleEntity } from '../../role/role.entity';
import { Logger } from '../../../utils/logger';

export class UserRoute extends CommonRoutesConfig<UserController> {
  constructor(
    app: express.Application,
    roles: RoleEntity[] = [],
    controller: UserController = new UserController()
  ) {
    super(app, 'User', controller, roles);
  }

  get route(): string {
    return (process.env.PATH_PREFIX ?? '') + '/users';
  }
  configureRoutes(): Application {
    const authMid = new AuthorizationMiddleware();
    Logger.info('user', this.adminRole);

    this.app.route(this.route).get(this.controller.findAllResources);

    this.app.route(`${this.route}/:id`).get(
      // authMid.isAuthorizedUser,
      // authMid.isAuthByRole(['admin']),
      this.controller.findSingleResource
    ),
      this.app
        .route(this.route)
        .post(
          this.controller.validateCreationSchema,
          this.controller.addResource
        );
    this.app.route(this.route + '/:id').delete(this.controller.deleteResource);
    return this.app;
  }
}
