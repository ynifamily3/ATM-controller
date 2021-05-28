import { AtmModel } from "./AtmModel";
import {
  createCard,
  authenticatePIN,
  deauthentication,
  createAccount,
  getBalance,
  deposit,
  withdraw,
  isValidCard,
  isValidAccount,
} from "../repo/bank";

class AtmController {
  #atm: AtmModel;
  constructor(atm: AtmModel) {
    this.#atm = atm;
  }

  async createCard(cardName: string, pin: string) {
    try {
      await createCard(cardName, pin);
    } catch (e) {
      throw new Error(e);
    }
  }

  async createAccount(accountName: string) {
    if (this.#atm.getState() === "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    try {
      if (
        (await isValidCard(this.#atm.getCurrentCardName()!)) &&
        !(await isValidAccount(this.#atm.getCurrentCardName()!, accountName))
      ) {
        await createAccount(
          this.#atm.getToken()!,
          this.#atm.getCurrentCardName()!,
          accountName
        );
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async insertCard(cardName: string) {
    if (this.#atm.getState() !== "IDLE") {
      throw new Error("There is a card already inserted.");
    }
    const isValid = await isValidCard(cardName);
    if (!isValid) {
      throw new Error("This card does not exist.");
    }
    this.#atm.setState("CARD_INSERTED");
    this.#atm.setCurrentCardName(cardName);
  }

  async ejectCard() {
    if (this.#atm.getState() === "IDLE") {
      throw new Error("There is no card inserted.");
    }
    try {
      await deauthentication(this.#atm.getToken());
    } catch (e) {
      console.log(e);
    } finally {
      this.#atm.setState("IDLE");
      this.#atm.setCurrentCardName(null);
      this.#atm.setCurrentAccountName(null);
    }
  }

  async authenticatePIN(pin: string) {
    if (this.#atm.getState() == "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() !== "CARD_INSERTED") {
      throw new Error("PIN authentication has already been completed.");
    }
    try {
      const token = await authenticatePIN(this.#atm.currentCardName!, pin);
      this.#atm.setToken(token);
      this.#atm.setState("PIN_CORRECT");
    } catch (e) {
      throw new Error(e);
    }
  }

  async selectAccount(accountName: string) {
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    if (this.#atm.getState() === "IDLE") {
      throw new Error("There is no card inserted.");
    }
    try {
      if (await isValidAccount(this.#atm.currentCardName!, accountName)) {
        this.#atm.setState("ACCOUNT_SELECTED");
        this.#atm.setCurrentAccountName(accountName);
      } else {
        throw new Error("The account does not exist.");
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async showBalance() {
    if (this.#atm.getState() == "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    if (this.#atm.getState() === "PIN_CORRECT") {
      throw new Error("No account has been selected.");
    }
    try {
      return +(await getBalance(
        this.#atm.getToken()!,
        this.#atm.getCurrentCardName()!,
        this.#atm.getCurrentAccountName()!
      ));
    } catch (e) {
      throw new Error(e);
    }
  }

  async deposit(amount: number) {
    if (this.#atm.getState() == "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    if (this.#atm.getState() === "PIN_CORRECT") {
      throw new Error("No account has been selected.");
    }
    if (amount < 0) {
      throw new Error("Input value error.");
    }
    try {
      await deposit(
        this.#atm.getToken()!,
        this.#atm.getCurrentCardName()!,
        this.#atm.getCurrentAccountName()!,
        amount
      );
    } catch (e) {
      throw new Error(e);
    }
  }

  async withdraw(amount: number) {
    if (this.#atm.getState() == "IDLE") {
      throw new Error("There is no card inserted.");
    }
    if (this.#atm.getState() === "CARD_INSERTED") {
      throw new Error("You need to authenticate the PIN on the card.");
    }
    if (this.#atm.getState() === "PIN_CORRECT") {
      throw new Error("No account has been selected.");
    }
    if (amount < 0) {
      throw new Error("Input value error.");
    }
    try {
      await withdraw(
        this.#atm.getToken()!,
        this.#atm.getCurrentCardName()!,
        this.#atm.getCurrentAccountName()!,
        amount
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
export { AtmController };
