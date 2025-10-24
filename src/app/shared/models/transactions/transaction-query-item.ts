import {Transaction} from './transaction';

export interface TransactionQueryItem extends Transaction {
  accountName: string;
  accountNumber: number;
}
