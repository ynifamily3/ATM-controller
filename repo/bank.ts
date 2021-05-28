import { IAccount, ICard } from "../entity";

// Virtual db
const cards = new Map<string, ICard>(); // <cardName, card>
const temporaryAuthenticationToken = new Map<string, string>(); // <authenticationToken, cardName>

function createRandomToken(): string {
  return Math.random().toString(36).substring(5);
}

function isPINAuthenticated(token: string, cardName: string) {
  return (
    temporaryAuthenticationToken.has(token) &&
    temporaryAuthenticationToken.get(token) === cardName
  );
}

async function createCard(cardName: string, pin: string) {
  return await new Promise<string>((resolve, reject) => {
    if (!cards.has(cardName)) {
      const card: ICard = {
        pin,
        accounts: new Map<string, IAccount>(),
      };
      cards.set(cardName, card);
      resolve("success");
    } else {
      reject("A card with this name already exists.");
    }
  });
}

async function authenticatePIN(cardName: string, pin: string) {
  return await new Promise<string>((resolve, reject) => {
    if (!cards.has(cardName)) {
      reject("This card does not exist.");
    } else {
      const card = cards.get(cardName)!;
      if (card.pin === pin) {
        while (true) {
          const token = createRandomToken();
          if (!temporaryAuthenticationToken.has(token)) {
            temporaryAuthenticationToken.set(token, cardName);
            resolve(token);
            break;
          }
        }
      } else {
        reject("PIN numbers do not match.");
      }
    }
  });
}

async function deauthentication(token: string) {
  return await new Promise<string>((resolve) => {
    if (temporaryAuthenticationToken.has(token)) {
      temporaryAuthenticationToken.delete(token);
      resolve("success");
    }
  });
}

async function createAccount(
  token: string,
  cardName: string,
  accountName: string
) {
  return await new Promise<string>((resolve, reject) => {
    if (!isPINAuthenticated(token, cardName)) {
      reject("You need to authenticate the PIN on the card.");
      return;
    }
    if (!cards.has(cardName)) {
      reject("This card does not exist.");
    } else {
      const card = cards.get(cardName)!;
      const accounts = card.accounts;
      if (accounts.has(accountName)) {
        reject("The same account name already exists on this card.");
      } else {
        accounts.set(accountName, { balance: 0 });
        resolve("success");
      }
    }
  });
}

async function getBalance(
  token: string,
  cardName: string,
  accountName: string
) {
  return await new Promise<string>((resolve, reject) => {
    if (!isPINAuthenticated(token, cardName)) {
      reject("You need to authenticate the PIN on the card.");
      return;
    }
    if (!cards.has(cardName)) {
      reject("This card does not exist.");
    } else {
      const card = cards.get(cardName)!;
      const accounts = card.accounts;
      if (!accounts.has(accountName)) {
        reject("This account does not exist.");
      } else {
        resolve("" + accounts.get(accountName)!.balance);
      }
    }
  });
}

async function deposit(
  token: string,
  cardName: string,
  accountName: string,
  amount: number
) {
  return await new Promise<string>((resolve, reject) => {
    if (!isPINAuthenticated(token, cardName)) {
      reject("You need to authenticate the PIN on the card.");
      return;
    }
    if (!cards.has(cardName)) {
      reject("This card does not exist.");
    } else {
      const card = cards.get(cardName)!;
      const accounts = card.accounts;
      if (!accounts.has(accountName)) {
        reject("This account does not exist.");
      } else {
        accounts.get(accountName)!.balance += Math.floor(amount);
        resolve("success");
      }
    }
  });
}

async function withdraw(
  token: string,
  cardName: string,
  accountName: string,
  amount: number
) {
  return await deposit(token, cardName, accountName, -amount);
}

export {
  createCard,
  authenticatePIN,
  deauthentication,
  createAccount,
  getBalance,
  deposit,
  withdraw,
};
