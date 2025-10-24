import {Page} from '../pagination/page';

export interface TransactionQuery extends Page {
  startDate: Date | string;
  endDate: Date | string;
}
