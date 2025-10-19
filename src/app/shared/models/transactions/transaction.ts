export interface Transaction {
  transactionId: number;
  categoryId: number;
  financialInstitutionId: number;
  fitId: string;
  amount: number;
  name: string;
  memo: string;
  recordCreatedOn: Date;
  lastUpdatedOn: Date;
  postedOn: Date;
  dateOfTransaction: Date;
}
