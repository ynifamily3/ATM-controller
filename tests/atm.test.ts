import { AtmModel } from "../atm/AtmModel";
import { AtmController } from "../atm/AtmController";

test("Create Card, Create Account, deposit $100, Balance check", () => {
  const atmController = new AtmController(new AtmModel());
  atmController.createCard("mastercard-1", 123456);
  atmController.insertCard("mastercard-1");
  atmController.authenticatePIN(123456);
  atmController.createAccount("normal");
  atmController.selectAccount("normal");
  atmController.deposit(100);
  expect(atmController.showBalance()).toBe(100);
});

test("Create Card, Create Account, Deposit $100, Withdraw $30, Balance check", () => {
  const atmController = new AtmController(new AtmModel());
  atmController.createCard("mastercard-1", 123456);
  atmController.insertCard("mastercard-1");
  atmController.authenticatePIN(123456);
  atmController.createAccount("normal");
  atmController.selectAccount("normal");
  atmController.deposit(100);
  atmController.withdraw(30);
  expect(atmController.showBalance()).toBe(70);
});

test("Create Card, Create 2 Account, deposit $100 / $30, Balance check", () => {
  const atmController = new AtmController(new AtmModel());
  atmController.createCard("mastercard-1", 123456);
  atmController.insertCard("mastercard-1");
  atmController.authenticatePIN(123456);
  atmController.createAccount("normal");
  atmController.createAccount("sub");
  atmController.selectAccount("normal");
  atmController.deposit(100);
  expect(atmController.showBalance()).toBe(100);
  atmController.selectAccount("sub");
  atmController.deposit(30);
  expect(atmController.showBalance()).toBe(30);
});
