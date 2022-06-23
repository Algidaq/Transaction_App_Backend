import express from 'express';
import { RoleEntity } from '../modules/role/role.entity';
import { RoleDao } from '../modules/role/role.dao';
export abstract class CommonRoutesConfig<T> {
  private _name: String;
  app: express.Application;
  userRoles: RoleEntity[] = [];
  constructor(app: express.Application, name: String, public controller: T) {
    this._name = name;
    this.app = app;
    this.configureRoutes();
    new RoleDao().getAllResources().then((roles) => {
      console.log('roles', roles);
      this.userRoles.push(...roles);
    });
  }

  get name(): String {
    return this._name;
  }

  get adminRole(): RoleEntity | undefined {
    if (this.userRoles.length === 0) return;
    return this.getUserRoleByName('admin');
  }

  private getUserRoleByName = (name: string): RoleEntity | undefined => {
    let index = this.userRoles.findIndex(
      (element) => element.role.toLowerCase() === name.toLowerCase()
    );
    console.log('inndex', index);
    if (index === -1) return;
    return this.userRoles[index];
  };

  get pathPrefix(): string {
    return process.env.PATH_PREFIX ?? '';
  }

  abstract configureRoutes(): express.Application;
  abstract get route(): string;
}
