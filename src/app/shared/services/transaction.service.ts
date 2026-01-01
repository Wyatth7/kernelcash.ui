import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {OkApiResponseWithData} from '../models/api-response/ok-api-response-with-data';
import {RequestUtils} from '../utils/request-utils';
import {TransactionQueryItem} from '../models/transactions/transaction-query-item';
import {UnallocatedTransaction} from '../models/transactions/unallocated-transaction';
import {TransactionSearch} from '../forms/transactions/transaction-search-form';
import {Page} from '../models/pagination/page';
import {DateUtils} from '../utils/date';
import {TransactionType} from '../models/enum/transaction-type';

@Injectable({providedIn: 'root'})
export class TransactionService {
  private readonly _http = inject(HttpClient);
  private readonly _basePath = environment.apiUrl + 'transaction'

  public async getTransactions(query: Partial<TransactionSearch>, page?: Page): Promise<TransactionQueryItem[]> {
    let dtStart = undefined;
    let dtEnd = undefined;

    if (query.startDate)
      dtStart = DateUtils.convertDateToDateTime(query.startDate);

    if (query.endDate)
      dtEnd = DateUtils.convertDateToDateTime(query.endDate, false)

    delete query.startDate;
    delete query.endDate;

    const request$ = this._http.get<OkApiResponseWithData<TransactionQueryItem[]>>(this._basePath, {
      params: RequestUtils.getQueryParamsFromObject({...query, startDate: dtStart, endDate:  dtEnd,  ...page}, true),
      responseType: 'json'
    })

    const response = await lastValueFrom(request$);

    return response.data;
  }

  public async getUnallocatedTransactions(startDate: Date, endDate: Date, transactionType: TransactionType): Promise<UnallocatedTransaction[]> {
    const params = RequestUtils.getQueryParamsFromObject({startDate, endDate, transactionType})

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

  public signTransaction(value: number, type: TransactionType): number {
    if (value === 0)
      return 0;

    return type === TransactionType.Debit ? -1 * value : value;
  }
}
