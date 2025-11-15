import {BudgetBase} from './budget-base';

export interface BudgetQueryListItem extends BudgetBase {
  budgetId: number;
  budgetGroupId: number;
  budgetGroupName: string;
  remaining: number;
}
