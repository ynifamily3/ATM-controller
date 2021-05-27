import { AtmModel, IAccount, ICard } from "./AtmModel";

class AtmController {
  #atm: AtmModel;
  constructor(atm: AtmModel) {
    this.#atm = atm;
  }

  // private
  #getCard = (): ICard => {
    return this.#atm.getCards().get(this.#atm.getCurrentCardName()!)!;
  };

  // private
  #getAccount = (): IAccount => {
    return this.#getCard()!.accounts.get(this.#atm.getCurrentAccountName()!)!;
  };

  // ext.
  createCard(cardName: string, pin: number) {
    if (this.#atm.getCards().get(cardName)) {
      throw new Error("A card with this name already exists.");
    }
    const card: ICard = {
      pin,
      accounts: new Map<string, IAccount>(),
    };
    this.#atm.getCards().set(cardName, card);
  }

  insertCard(cardName: string) {
    if (this.#atm.getState() !== "IDLE") {
      throw new Error("There is a card already inserted.");
    }
    if (!this.#atm.getCards().has(cardName)) {
      throw new Error("This card does not exist.");
    }
    this.#atm.setState("CARD_INSERTED");
    this.#atm.setCurrentCardName(cardName);
  }

  ejectCard() {
    if (this.#atm.getState() === "IDLE") {
      throw new Error("There is no card inserted.");
    }
    this.#atm.setState("IDLE");
    this.#atm.setCurrentCardName(null);
    this.#atm.setCurrentAccountName(null);
  }

  authenticatePIN(pin: number) {
    if (this.#atm.getState() == "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() !== "CARD_INSERTED") {
      throw new Error("PIN authentication has already been completed.");
    }
    if (this.#getCard().pin === pin) {
      this.#atm.setState("PIN_CORRECT");
    } else {
      throw new Error("PIN numbers do not match.");
    }
  }

  createAccount(accountName: string) {
    if (this.#atm.getState() === "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    if (this.#getCard().accounts.has(accountName)) {
      throw new Error("A card with this name already exists.");
    }
    this.#getCard().accounts.set(accountName, { balance: 0 });
  }

  selectAccount(accountName: string) {
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    if (this.#atm.getState() === "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (!this.#getCard().accounts.has(accountName)) {
      throw new Error("The account does not exist.");
    }
    this.#atm.setState("ACCOUNT_SELECTED");
    this.#atm.setCurrentAccountName(accountName);
  }

  showBalance() {
    if (this.#atm.getState() == "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    if (this.#atm.getState() === "PIN_CORRECT") {
      throw new Error("No account has been selected.");
    }
    return this.#getAccount().balance;
  }

  deposit(amount: number) {
    if (this.#atm.getState() == "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    if (this.#atm.getState() === "PIN_CORRECT") {
      throw new Error("No account has been selected.");
    }
    if (
      amount < 0 ||
      this.#getAccount().balance + amount >= Number.MAX_SAFE_INTEGER ||
      Number.isNaN(amount) ||
      !Number.isFinite(amount)
    ) {
      throw new Error("Input value error.");
    }
    this.#getAccount().balance += Math.floor(amount);
  }

  withdraw(amount: number) {
    if (this.#atm.getState() == "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    if (this.#atm.getState() === "PIN_CORRECT") {
      throw new Error("No account has been selected.");
    }
    if (amount < 0 || Number.isNaN(amount) || !Number.isFinite(amount)) {
      throw new Error("Input value error.");
    }
    if (this.#getAccount().balance < amount) {
      throw new Error("The amount available for withdrawal is insufficient.");
    }
    this.#getAccount().balance -= Math.floor(amount);
  }
}

export { AtmController };
