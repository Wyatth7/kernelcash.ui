import {SpendingBucketType} from './spending-bucket-type';

export interface CreateSpendingBucket {
  name: string;
  total: number;
  spendingBucketType: SpendingBucketType;
}
