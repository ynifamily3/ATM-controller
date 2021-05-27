interface Account {
  balance: number;
}

interface Card {
  pin: number;
  accounts: Account[];
}

class AtmModel {
  cards: Map<string, Card>; // <cardName, card>
  constructor() {
    this.cards = new Map<string, Card>();
  }
  getCards() {
    return this.cards;
  }
}

export { AtmModel };
