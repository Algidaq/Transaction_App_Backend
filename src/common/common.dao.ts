import {
  Repository,
  ObjectLiteral,
  EntityTarget,
  FindOneOptions,
} from 'typeorm';
import ApplicationDataSource from '../database/database';
export abstract class ICommonDao<T extends ObjectLiteral> {
  private _repo: Repository<T>;
  constructor(target: EntityTarget<T>) {
    this._repo = ApplicationDataSource.getRepository<T>(target);
  }
  get repo(): Repository<T> {
    return this._repo;
  }
  abstract addResource(resource: any): Promise<T>;
  abstract findSingleResource(option: FindOneOptions<T>): Promise<T | null>;
}
