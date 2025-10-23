import {BudgetBase} from './budget-base';
import {CreateSpendingBucket} from './create-spending-bucket';

export interface CreateFullBudget extends BudgetBase {
  spendingBuckets: CreateSpendingBucket[];
}
