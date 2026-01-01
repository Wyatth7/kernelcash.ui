import {SplitTransactionWithBudget} from './split-transaction-with-budget';
import {TransactionType} from '../enum/transaction-type';

export interface UnallocatedTransaction {
  transactionId: number;
  name: string;
  amount: number;
  accountName: string;
  accountNumber: number;
  splitTransactionWithBudgets: SplitTransactionWithBudget[];
  transactionType: TransactionType;
}
