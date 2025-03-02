export enum Details {
  Debit = "Debit",
  Credit = "Credit",
}

export interface Transaction {
  details: Details;
  postingDate: string;
  description: string;
  amount: number;
  type: string;
  balance: number;
}

export interface Record {
  Details: string;
  "Posting Date": string;
  Description: string;
  Amount: string;
  Type: string;
  Balance: string;
}
