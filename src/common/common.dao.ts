import {
  Repository,
  ObjectLiteral,
  EntityTarget,
  FindOneOptions,
  FindManyOptions,
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
  abstract getAllResources(options?: FindManyOptions<T>): Promise<T[]>;
  abstract getAllResourcesAndCount(
    options?: FindManyOptions<T>
  ): Promise<[T[], number]>;
  abstract deleteResource(resource: T): Promise<T>;

  abstract updateResource(resource: T): Promise<T>;
}
