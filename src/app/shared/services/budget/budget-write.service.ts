import {inject, Injectable} from '@angular/core';
import {SpendingBucketBase} from '../../models/budgets/spending-bucket-base';
import {BudgetBase} from '../../models/budgets/budget-base';
import {environment} from '../../../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {OkApiResponseWithData} from '../../models/api-response/ok-api-response-with-data';

@Injectable({ providedIn: 'root' })
export class BudgetWriteService {
  private readonly _http = inject(HttpClient);

  private readonly _basePath = environment.apiUrl + 'budget'

  public async createBudgetGroup(name: string): Promise<number> {
    const response = await lastValueFrom(this._http.post<OkApiResponseWithData<number>>(
      this._basePath + '/group',
      { name }
    ));

    return response.data;
  }

  public async createBudget(budgetGroupId: number, budget: BudgetBase): Promise<number> {
    const response = await lastValueFrom(this._http.post<OkApiResponseWithData<number>>(
      `${this._basePath}/${budgetGroupId}`,
      { ...budget }
    ));

    return response.data;
  }

  public async createSpendingBudgets(budgetId: number, spendingBuckets: SpendingBucketBase[]): Promise<number[]> {
    const response = await lastValueFrom(this._http.post<OkApiResponseWithData<number[]>>(
      `${this._basePath}/${budgetId}/spendingBuckets`,
      [ ...spendingBuckets ]
    ));

    return response.data;
  }
}
