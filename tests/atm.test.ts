import { AtmModel } from "../atm/AtmModel";
import { AtmController } from "../atm/AtmController";
import { resetDB } from "../repo/bank";

describe("Expect all transactions to go well.", () => {
  beforeEach(() => {
    resetDB();
  });
  test("Create Card, Create Account, deposit $100, Balance check", async () => {
    const atmController = new AtmController(new AtmModel());
    await atmController.createCard("mastercard-1", "123456");
    await atmController.insertCard("mastercard-1");
    await atmController.authenticatePIN("123456");
    await atmController.createAccount("normal");
    await atmController.selectAccount("normal");
    await atmController.deposit(100);
    expect(await atmController.showBalance()).toBe(100);
  });

  test("Create Card, Create Account, Deposit $100, Withdraw $30, Balance check", async () => {
    const atmController = new AtmController(new AtmModel());
    await atmController.createCard("mastercard-1", "123456");
    await atmController.insertCard("mastercard-1");
    await atmController.authenticatePIN("123456");
    await atmController.createAccount("normal");
    await atmController.selectAccount("normal");
    await atmController.deposit(100);
    await atmController.withdraw(30);
    expect(await atmController.showBalance()).toBe(70);
  });

  test("Create Card, Create 2 Account, deposit $100 / $30, Balance check", async () => {
    const atmController = new AtmController(new AtmModel());
    await atmController.createCard("mastercard-1", "123456");
    await atmController.insertCard("mastercard-1");
    await atmController.authenticatePIN("123456");
    await atmController.createAccount("normal");
    await atmController.createAccount("sub");
    await atmController.selectAccount("normal");
    await atmController.deposit(100);
    expect(await atmController.showBalance()).toBe(100);
    await atmController.selectAccount("sub");
    await atmController.deposit(30);
    expect(await atmController.showBalance()).toBe(30);
  });
});
