import {TransactionType} from '../../enum/transaction-type';

export interface SpendingBucketTransactions {
  spendingBucketTransactionId: number;
  transactionId: number;
  amount: number;
  transactionName: string;
  accountName: string;
  accountNumber: number;
  transactionType: TransactionType;
}
