import express from 'express';
export abstract class CommonRoutesConfig<T> {
  private _name: String;
  app: express.Application;
  constructor(app: express.Application, name: String, public controller: T) {
    this._name = name;
    this.app = app;
    this.configureRoutes();
  }

  get name(): String {
    return this._name;
  }

  abstract configureRoutes(): express.Application;
  abstract get route(): string;
}
