import { AtmModel } from "./AtmModel";

class AtmController {
  atm: AtmModel;
  constructor(atm: AtmModel) {
    this.atm = atm;
  }
}

export { AtmController };
