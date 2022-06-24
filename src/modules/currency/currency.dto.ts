import { ICommonQueryParams } from '../../common/common.queryparams';
export interface ICreateCurrencyDto {
  name: string;
  symbol: string;
}

export interface IUpdateCurrencyDto {
  name?: string;
  symbol?: string;
}
export function getCurrencyFromBody(body: any): ICreateCurrencyDto {
  const json = { ...body };
  return { name: json['name'] ?? 'N/A', symbol: json['symbol'] ?? 'N/A' };
}

export interface ICurrencyQueryParams extends ICommonQueryParams {
  name?: string;
  symbol?: string;
}
