import {Page} from '../pagination/page';

export interface TransactionQueryParams extends Page {
  startDate: string;
  endDate: string;
}
