export interface ICommonQueryParams {
  page?: string;
  limit?: string;
  orderBy?: string;
  order?: OrderType;
}

export declare type OrderType = 'asc' | 'desc';
