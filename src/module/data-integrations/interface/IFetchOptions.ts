import { IRequestOptions } from './IRequestOptions';
import { IResponseOptions } from './IResponseOptions';

export interface IFetchOptions {
  requestOptions: IRequestOptions;
  responseOptions: IResponseOptions;
  timeout?: number;
  body: Record<string, unknown>;
}
