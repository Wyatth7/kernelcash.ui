import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Transaction} from '../models/transactions/transaction';
import {environment} from '../../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {OkApiResponseWithData} from '../models/api-response/ok-api-response-with-data';
import {TransactionQuery} from '../models/transactions/transaction-query';
import {RequestUtils} from '../utils/request-utils';
import {TransactionQueryParams} from '../models/transactions/transaction-query-params';

@Injectable({providedIn: 'root'})
export class TransactionService {
  private readonly _http = inject(HttpClient);
  private readonly _basePath = environment.apiUrl + 'transaction'

  public async getTransactions(query: TransactionQueryParams): Promise<Transaction[]> {
    const request$ = this._http.get<OkApiResponseWithData<Transaction[]>>(this._basePath, {
      params: RequestUtils.getQueryParamsFromObject(query),
      responseType: 'json'
    })

    const response = await lastValueFrom(request$);

    return response.data;
  }
}
