export interface IAccount {
  balance: number;
}

export interface ICard {
  pin: string;
  accounts: Map<string, IAccount>; // <accountName, account>
}

export type IAtmState =
  | "IDLE"
  | "CARD_INSERTED"
  | "PIN_CORRECT"
  | "ACCOUNT_SELECTED";
