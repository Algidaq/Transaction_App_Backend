import express from 'express';
import { RoleEntity } from '../modules/role/role.entity';
import { RoleDao } from '../modules/role/role.dao';
import { Logger } from '../utils/logger';
export abstract class CommonRoutesConfig<T> {
  private _name: string;
  app: express.Application;
  constructor(
    app: express.Application,
    name: string,
    public controller: T,
    public userRoles: RoleEntity[] = []
  ) {
    this._name = name;
    this.app = app;
    this.configureRoutes();
  }

  get name(): string {
    return this._name;
  }

  get adminRole(): RoleEntity | undefined {
    if (this.userRoles.length === 0) return;
    return this.getUserRoleByName('admin');
  }

  private getUserRoleByName = (name: string): RoleEntity | undefined => {
    const index = this.userRoles.findIndex(
      (element) => element.role.toLowerCase() === name.toLowerCase()
    );
    Logger.info('inndex', index);
    if (index === -1) return;
    return this.userRoles[index];
  };

  get pathPrefix(): string {
    return process.env.PATH_PREFIX ?? '';
  }

  abstract configureRoutes(): express.Application;
  abstract get route(): string;
}
