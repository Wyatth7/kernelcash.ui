import {ApiResponseBase} from './api-response-base';

export interface OkApiResponseWithData<TData> extends ApiResponseBase {
  data: TData;
}
