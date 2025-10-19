import {ApiResponseBase} from './api-response-base';

export interface ErrorApiResponse<TData = void> extends ApiResponseBase {
    error: TData | string | string[];
}
