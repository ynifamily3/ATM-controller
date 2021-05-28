import { IAccount, IAtmState, ICard } from "../entity";
class AtmModel {
  state: IAtmState;
  token: string | null;
  currentCardName: string | null;
  currentAccountName: string | null;

  constructor() {
    this.state = "IDLE";
    this.token = null;
    this.currentCardName = null;
    this.currentAccountName = null;
  }

  getState() {
    return this.state;
  }

  setState(state: IAtmState) {
    this.state = state;
  }

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
  }

  getCurrentCardName() {
    return this.currentCardName;
  }

  setCurrentCardName(cardName: string | null) {
    this.currentCardName = cardName;
  }

  getCurrentAccountName() {
    return this.currentAccountName;
  }

  setCurrentAccountName(accountName: string | null) {
    this.currentAccountName = accountName;
  }
}

export { IAccount, ICard, IAtmState, AtmModel };
