import {SplitTransactionWithBudget} from './split-transaction-with-budget';

export interface UnallocatedTransaction {
  transactionId: number;
  name: string;
  amount: number;
  accountName: string;
  accountNumber: number;
  splitTransactionWithBudgets: SplitTransactionWithBudget[];
}
