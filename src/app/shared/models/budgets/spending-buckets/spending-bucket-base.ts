import {SpendingBucketType} from './spending-bucket-type';

export interface SpendingBucketBase {
  name: string;
  total: number;
  remaining: number;
  category: string;
  spendingBucketType: SpendingBucketType;
}
