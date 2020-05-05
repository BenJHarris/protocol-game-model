import { Set, Map, hash, List } from "immutable";

class Simulation {
  constructor(network) {
    this.network = network;
    this.networkSnapshots = List();
    this.currentSnapshot = 0;
  }

  setSnapshot(snapNum) {
    this.network = this.networkSnapshots.get(snapNum);
  }

  parseCommandString(commandString) {
    return commandString
      .trim()
      .split(";")
      .map((s) => s.trim());
  }

  runCommand(command) {
    const openBrace = command.indexOf("(");
    const closeBrace = command.indexOf(")");

    if (!openBrace || !closeBrace) {
      throw new Error(`Invalid Command ${command}`);
    }

    const cName = command.slice(0, openBrace);
    const cArg = command.slice(openBrace + 1, closeBrace);

    let matched = true;

    this.networkSnapshots.push(this.network.clone());
    this.network.step++;

    switch (cName) {
      case "transmit":
        this.network.transmit(cArg);
        break;
      case "block":
        this.network.block(cArg);
        break;
      case "inject":
        this.network.inject(cArg);
        break;
      case "new_session":
        this.network.newSession();
        break;
      default:
        matched = false;
    }

    if (!matched) {
      this.networkSnapshots.pop;
      this.network.step--;
    }
  }
}

export { Simulation };
