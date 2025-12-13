export interface User {
  nameFirst: string;
  nameLast: string;
  nameFull: string;
  email: string;
  budgetGroupId: number; // temporary for MVP only
  phone: string;
  lastLoginOn: Date;
  invitedOn: Date;
}
