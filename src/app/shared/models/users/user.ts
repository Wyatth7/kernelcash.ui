export interface User {
  nameFirst: string;
  nameLast: string;
  nameFull: string;
  email: string;
  budgetGroupIds: number[]; // temporary for MVP only
  phone: string;
  lastLoginOn: Date;
  invitedOn: Date;
}
