import { AtmModel } from "../atm/AtmModel";
import { AtmController } from "../atm/AtmController";

test("Create Card, Create Account, Add $100, Balance check", () => {
  const atmController = new AtmController(new AtmModel());
  atmController.createCard("mastercard-1", 123456);
  atmController.insertCard("mastercard-1");
  atmController.authenticatePIN(123456);
  atmController.createAccount("normal");
  atmController.selectAccount("normal");
  atmController.deposit(100);
  expect(atmController.showBalance()).toBe(100);
});
