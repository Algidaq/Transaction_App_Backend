import { CommonRoutesConfig } from '../../common/common.route.config';
import express from 'express';
import { AuthController } from './auth.controller';

export class AuthRoutes extends CommonRoutesConfig<AuthController> {
  constructor(app: express.Application) {
    super(app, 'AuthenticationRoute', new AuthController());
  }
  configureRoutes(): express.Application {
    this.app
      .route(this.route)
      .post(this.controller.validateAuthSchema, this.controller.auth);
    return this.app;
  }
  get route(): string {
    return this.pathPrefix + '/auth';
  }
}
