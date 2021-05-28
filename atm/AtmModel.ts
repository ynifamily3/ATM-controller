import { IAccount, IAtmState, ICard } from "../entity";
class AtmModel {
  cards: Map<string, ICard>; // <cardName, card>
  state: IAtmState;
  currentCardName: string | null;
  currentAccountName: string | null;

  constructor() {
    this.cards = new Map<string, ICard>();
    this.state = "IDLE";
    this.currentCardName = null;
    this.currentAccountName = null;
  }

  getCards() {
    return this.cards;
  }

  setCards(cards: Map<string, ICard>) {
    this.cards = cards;
  }

  getState() {
    return this.state;
  }

  setState(state: IAtmState) {
    this.state = state;
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
