import {SpendingBucketBase} from './spending-bucket-base';
import {SpendingBucketTransactions} from './spending-bucket-transactions';

export interface SelectedSpendingBucketView extends SpendingBucketBase{
  spendingBucketId: number;
  spendingBucketTransactions: SpendingBucketTransactions[];
}
