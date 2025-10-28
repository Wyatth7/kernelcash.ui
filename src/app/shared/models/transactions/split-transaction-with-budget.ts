export interface SplitTransactionWithBudget {
  spendingBucketTransactionId: number;
  amount: number;
  spendingBucketId: number;
  spendingBucketName: string;
  budgetId: number;
  budgetName: string;
}
