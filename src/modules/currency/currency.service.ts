import { CurrencyDao } from './currency.dao';
import {
  ICurrencyQueryParams,
  getCurrencyFromBody,
  IUpdateCurrencyDto,
} from './currency.dto';
import { CurrencyEntity } from './currency.entity';
import { FindManyOptions, FindOptionsWhere, Like, Not } from 'typeorm';
import { getPagination } from '../../utils/utils';
export class CurrencyService {
  constructor(private dao: CurrencyDao = new CurrencyDao()) {}

  findOnById = async (params: any): Promise<CurrencyEntity | null> => {
    const id: number = Number.parseInt(params.id ?? '-1');
    return this.dao.findSingleResource({ where: { id: id } });
  };

  addNewCurrency = async (body: any): Promise<CurrencyEntity> => {
    const entity = getCurrencyFromBody(body);
    return this.dao.addResource(entity);
  };

  getAllCurrencies = async (queryParams: any): Promise<CurrencyEntity[]> => {
    const options = this.getCurrencyFindManyOptions(queryParams);
    options.take = undefined;
    options.skip = undefined;
    return this.dao.getAllResources(options);
  };

  getAllCurrenciesAndCount = async (
    queryParams: any
  ): Promise<[CurrencyEntity[], number]> => {
    const options = this.getCurrencyFindManyOptions(queryParams);
    return this.dao.getAllResourcesAndCount(options);
  };

  deleteCurrency = async (params: any): Promise<CurrencyEntity | null> => {
    const currency = await this.findOnById(params);
    if (currency === null) return null;
    return await this.dao.deleteResource(currency);
  };

  updateCurrency = async (
    params: any,
    body: any
  ): Promise<CurrencyEntity | null> => {
    const currency = await this.findOnById(params);
    if (currency === null) return null;
    const updateCurrency = this.getCurrencyUpdateEntity(currency, body);
    return await this.dao.updateResource(updateCurrency);
  };

  getCurrencyUpdateEntity = (
    currency: CurrencyEntity,
    body: IUpdateCurrencyDto
  ): CurrencyEntity => {
    currency.name = body.name ?? currency.name;
    currency.symbol = body.symbol ?? currency.symbol;
    return currency;
  };

  getCurrencyFindManyOptions = (
    queryParams: ICurrencyQueryParams
  ): FindManyOptions<CurrencyEntity> => {
    const { skip, take } = getPagination(queryParams);
    const where: FindOptionsWhere<CurrencyEntity>[] = [];
    if (queryParams.name) where.push({ name: Like(queryParams.name) });
    if (queryParams.symbol) where.push({ name: Like(queryParams.symbol) });

    return {
      where: where.length > 0 ? where : undefined,
      skip: skip,
      take: take,
      order: !queryParams.orderBy
        ? { id: 'desc' }
        : {
            createDate:
              queryParams.orderBy === 'create_date'
                ? queryParams.order ?? 'desc'
                : undefined,

            name:
              queryParams.orderBy === 'name'
                ? queryParams.order ?? 'desc'
                : undefined,
            id:
              queryParams.orderBy === 'id'
                ? queryParams.order ?? 'desc'
                : undefined,
            symbol:
              queryParams.orderBy === 'symbol'
                ? queryParams.order ?? 'desc'
                : undefined,
          },
    };
  };
}
