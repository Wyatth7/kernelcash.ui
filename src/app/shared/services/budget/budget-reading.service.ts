import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {lastValueFrom} from 'rxjs';
import {OkApiResponseWithData} from '../../models/api-response/ok-api-response-with-data';
import {BudgetQueryListItem} from '../../models/budgets/budget-query-list-item';
import {Page} from '../../models/pagination/page';
import {RequestUtils} from '../../utils/request-utils';

@Injectable({ providedIn: 'root' })
export class BudgetReadingService {
  private readonly _http = inject(HttpClient);
  private readonly _basePath = `${environment.apiUrl}budget`

  public async getBudgetGroups(): Promise<void> {

  }

  public async getBudgetsForGroup(budgetGroupId: number, page: Page): Promise<BudgetQueryListItem[]> {
    const params = RequestUtils.getQueryParamsFromObject(page);

    const response = await lastValueFrom<OkApiResponseWithData<BudgetQueryListItem[]>>(
      this._http.get<OkApiResponseWithData<BudgetQueryListItem[]>>(`${this._basePath}/group/${budgetGroupId}/budgets`, {params})
    )

    return response.data;
  }

  public async getBudget(budgetId: number): Promise<void> {

  }


}
