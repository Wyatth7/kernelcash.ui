import {BudgetBase} from './budget-base';
import {SpendingBucket} from './spending-buckets/spending-bucket';

export interface BudgetView extends BudgetBase{
  budgetId: number;
  remaining: number;
  spendingBuckets: SpendingBucket[];
}
