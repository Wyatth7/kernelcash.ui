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
      const result = await lastValueFrom<OkApiResponseWithData<{ remaining: number }>>(this._http.post<OkApiResponseWithData<{ remaining: number }>>(`${this._baseUrl}/${spendingBucketId}`, [...transactions]));
      return result.data.remaining;
    } catch (e) {
      this._logger.error(`Could not create spending bucket transactions for spending bucket [${spendingBucketId}].\n\nException: ${e}`);
      return undefined;
    }
  }

}
