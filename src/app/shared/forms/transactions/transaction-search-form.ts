import {ListSortType} from '../../models/enum/list-sort-type';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {DateUtils} from '../../utils/date';

export function getTransactionSearchForm(builder: FormBuilder, transactionQueryFilter?: Partial<TransactionSearch>): FormGroup<TransactionSearchForm> {
  const dateRange = DateUtils.thisMonth();

  return builder.group({
    userId: new FormControl<number | null>(transactionQueryFilter?.userId || null),
    accountNumber: new FormControl<number | null>(transactionQueryFilter?.accountNumber || null),
    accountName: new FormControl<string | null>(transactionQueryFilter?.accountName || null),
    name: new FormControl<string | null>(transactionQueryFilter?.name || null),
    minAmount: new FormControl<number | null>(transactionQueryFilter?.minAmount || null),
    maxAmount: new FormControl<number | null>(transactionQueryFilter?.maxAmount || null),
    startDate: new FormControl<Date | null>(transactionQueryFilter?.startDate || dateRange[0]),
    endDate: new FormControl<Date | null>(transactionQueryFilter?.endDate || dateRange[1]),
    accountOrder: new FormControl<ListSortType | null>(transactionQueryFilter?.accountOrder || null),
    transactionDateOrder: new FormControl<ListSortType | null>(transactionQueryFilter?.transactionDateOrder || null),
    amountOrder: new FormControl<ListSortType | null>(transactionQueryFilter?.amountOrder || null),
    nameOrder: new FormControl<ListSortType | null>(transactionQueryFilter?.nameOrder || null),
  })
}

export interface TransactionSearchForm {
  userId: FormControl<number | null>;
  accountNumber: FormControl<number | null>;
  accountName: FormControl<string | null>;
  name: FormControl<string | null>;
  minAmount: FormControl<number | null>;
  maxAmount: FormControl<number | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
  accountOrder: FormControl<ListSortType | null>;
  transactionDateOrder: FormControl<ListSortType | null>;
  amountOrder: FormControl<ListSortType | null>;
  nameOrder: FormControl<ListSortType | null>;
}

export interface TransactionSearch {
  userId: number;
  accountNumber: number;
  accountName: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  startDate: Date;
  endDate: Date;
  accountOrder: ListSortType;
  transactionDateOrder: ListSortType;
  amountOrder: ListSortType;
  nameOrder: ListSortType;
}
