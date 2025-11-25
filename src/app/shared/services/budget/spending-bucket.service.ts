import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {SelectedSpendingBucketView} from '../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {lastValueFrom} from 'rxjs';
import {OkApiResponseWithData} from '../../models/api-response/ok-api-response-with-data';
import {
  CreateSpendingBucketTransaction
} from '../../models/budgets/spending-buckets/create-spending-bucket-transaction';
import {LoggingService} from '../logging.service';

type Remainging = {
  remaining: number;
}

export const DEFAULT_EXPENSE_CATEGORIES = [
  'Groceries',
  'Entertainment',
  'Travel',
  'Transportation',
  'Insurance',
  'Health',
  'Activities',
  'Food',
  'Housing'
]

@Injectable({ providedIn: 'root' })
export class SpendingBucketService {
  private readonly _logger = inject(LoggingService);
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl: string = `${environment.apiUrl}spendingBucket`;

  public async getSpendingBucketAndTransactions(spendingBucketId: number): Promise<SelectedSpendingBucketView> {
    const response = await lastValueFrom<OkApiResponseWithData<SelectedSpendingBucketView>>(
      this._http.get<OkApiResponseWithData<SelectedSpendingBucketView>>(`${this._baseUrl}/${spendingBucketId}`)
    );

    return response.data;
  }

  public async createSpendingBucketTransactions(spendingBucketId: number, transactions: CreateSpendingBucketTransaction[]): Promise<number | undefined> {
    try {
      const result = await lastValueFrom<OkApiResponseWithData<{ remaining: number }>>
      (
        this._http.post<OkApiResponseWithData<Remainging>>(`${this._baseUrl}/${spendingBucketId}`, [...transactions])
      );
      return result.data.remaining;
    } catch (e) {
      this._logger.error(`Could not create spending bucket transactions for spending bucket [${spendingBucketId}].\n\nException: ${e}`);
      return undefined;
    }
  }


  public async deallocateTransactions(spendingBucketTransactionIds: number[], spendingBucketId: number): Promise<number | undefined> {
    try {
      const result = await lastValueFrom<OkApiResponseWithData<Remainging>>(
        this._http.post<OkApiResponseWithData<Remainging>>(`${this._baseUrl}/${spendingBucketId}/deallocate`, {
          spendingBucketTransactionIds
        })
      )

      return result.data.remaining;
    } catch (e) {
      this._logger.error(`Could not deallocate spending bucket transactions for spending bucket ${spendingBucketId}. \n\nExeption: ${e}`);
      return undefined;
    }
  }

  public async getCategories(): Promise<string[]> {
    try {
      const result = await lastValueFrom<OkApiResponseWithData<string[]>>(
        this._http.get<OkApiResponseWithData<string[]>>(`${this._baseUrl}/categories`)
      );

      const categories = [...result.data, ...DEFAULT_EXPENSE_CATEGORIES];
      return [...new Set(categories)];
    } catch (e) {
      return DEFAULT_EXPENSE_CATEGORIES;
    }
  }
}
