import {SpendingBucketBase} from './spending-bucket-base';

export interface SpendingBucket extends SpendingBucketBase{
  spendingBucketId: number;
  budgetId: number;
}
