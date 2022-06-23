import { Application } from 'express';
import { CommonRoutesConfig } from '../../../common/common.route.config';
import express from 'express';
import { UserController } from '../controller/user.controller';
import { SimpleConsoleLogger } from 'typeorm';
import { AuthorizationMiddleware } from '../../../middlewares/authorization.middleware';

export class UserRoute extends CommonRoutesConfig<UserController> {
  constructor(
    app: express.Application,
    controller: UserController = new UserController()
  ) {
    super(app, 'User', controller);
  }

  get route(): string {
    return (process.env.PATH_PREFIX ?? '') + '/users';
  }
  configureRoutes(): Application {
    const authMid = new AuthorizationMiddleware();
    console.log('user', this.adminRole);
    this.app.route(this.route).get((req, res) => res.json({ users: [] }));

    this.app
      .route(`${this.route}/:id`)
      .get(
        authMid.isAuthorizedUser,
        authMid.isAuthByRole(['admin']),
        this.controller.findSingleResource
      ),
      this.app
        .route(this.route)
        .post(
          this.controller.validateCreationSchema,
          this.controller.addResource
        );
    return this.app;
  }
}
