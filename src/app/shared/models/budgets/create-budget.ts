import {BudgetBase} from './budget-base';
import {CreateSpendingBucket} from './spending-buckets/create-spending-bucket';

export interface CreateBudget extends BudgetBase {
  spendingBuckets: CreateSpendingBucket[];
}
