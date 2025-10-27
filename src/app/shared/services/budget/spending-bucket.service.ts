import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {SelectedSpendingBucketView} from '../../models/budgets/spending-buckets/selected-spending-bucket-view';
import {lastValueFrom} from 'rxjs';
import {OkApiResponseWithData} from '../../models/api-response/ok-api-response-with-data';

@Injectable({ providedIn: 'root' })
export class SpendingBucketService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl: string = `${environment.apiUrl}spendingBucket`;

  public async getSpendingBucketAndTransactions(spendingBucketId: number): Promise<SelectedSpendingBucketView> {
    const response = await lastValueFrom<OkApiResponseWithData<SelectedSpendingBucketView>>(
      this._http.get<OkApiResponseWithData<SelectedSpendingBucketView>>(`${this._baseUrl}/${spendingBucketId}`)
    );

    return response.data;
  }

}
