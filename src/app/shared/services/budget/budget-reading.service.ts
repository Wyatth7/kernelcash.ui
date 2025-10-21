import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BudgetReadingService {
  private readonly _http = inject(HttpClient);

  public async getBudgetGroups(): Promise<void> {

  }

  public async getBudgetsForGroup(budgetGroupId: number): Promise<void> {

  }

  public async getBudget(budgetId: number): Promise<void> {

  }


}
