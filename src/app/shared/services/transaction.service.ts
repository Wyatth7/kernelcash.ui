import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {OkApiResponseWithData} from '../models/api-response/ok-api-response-with-data';
import {RequestUtils} from '../utils/request-utils';
import {TransactionQueryParams} from '../models/transactions/transaction-query-params';
import {TransactionQueryItem} from '../models/transactions/transaction-query-item';
import {UnallocatedTransaction} from '../models/transactions/unallocated-transaction';

@Injectable({providedIn: 'root'})
export class TransactionService {
  private readonly _http = inject(HttpClient);
  private readonly _basePath = environment.apiUrl + 'transaction'

  public async getTransactions(query: TransactionQueryParams): Promise<TransactionQueryItem[]> {
    const request$ = this._http.get<OkApiResponseWithData<TransactionQueryItem[]>>(this._basePath, {
      params: RequestUtils.getQueryParamsFromObject(query),
      responseType: 'json'
    })

    const response = await lastValueFrom(request$);

    return response.data;
  }

  public async getUnallocatedTransactions(startDate: Date, endDate: Date): Promise<UnallocatedTransaction[]> {
    const params = RequestUtils.getQueryParamsFromObject({startDate, endDate})

    const response = await lastValueFrom<OkApiResponseWithData<UnallocatedTransaction[]>>(
      this._http.get<OkApiResponseWithData<UnallocatedTransaction[]>>(`${this._basePath}/unallocated`, {params})
    );

    return response.data;
  }

  public getTransactionSubTitle(accountName: string, accountNumber: number): string {
    if (accountName)
      return accountName;

    return `Account ending in ${accountNumber}`;
  }
}
