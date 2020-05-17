import { Set, Map, hash, List } from "immutable";
import { Fact } from "./Fact";

class Simulation {
  constructor(
    network,
    options = {
      newSessionCommand: "",
      responses: [],
    }
  ) {
    this.network = network;
    this.networkSnapshots = [];
    this.networkSnapshots.push(network.clone());
    this.currentSnapshot = 0;
    this.newSessionCommand = options.newSessionCommand;
  }

  setSnapshot(snapNum) {
    if (snapNum >= 0 && snapNum < this.networkSnapshots.length) {
      this.network = this.networkSnapshots[snapNum];
      this.currentSnapshot = snapNum;
    }
  }

  parseCommandString(commandString) {
    return commandString
      .trim()
      .split(";")
      .filter((s) => s.length > 0)
      .map((s) => s.trim());
  }

  runCommandList(commands) {
    this.setSnapshot(0);
    this.networkSnapshots = [];
    this.networkSnapshots.push(this.network.clone());
    commands.forEach((c) => {
      this.runCommand(c);
    });
  }

  runNewSessionCommand() {
    const split = this.newSessionCommand.split(",");
    console.log(split);
    const agentSplit = split[0].split("->");
    const from = agentSplit[0].trim();
    const to = agentSplit[1].trim();
    const fact = split[1].trim();

    console.log(new Fact(fact));

    this.network.createMessage(from, to, new Fact(fact));
  }

  runCommand(command, step = true) {
    const openBrace = command.indexOf("(");
    const closeBrace = command.indexOf(")");

    if (openBrace === -1 || closeBrace === -1) {
      throw new Error(`Invalid Command ${command}`);
    }

    const cName = command.slice(0, openBrace);
    const cArg = command.slice(openBrace + 1, closeBrace);

    let matched = true;
    if (step) {
      this.network.step++;
    }

    let res = false;

    switch (cName) {
      case "transmit":
        res = this.network.transmit(cArg);
        break;
      case "block":
        res = this.network.block(cArg);
        break;
      case "inject":
        res = this.network.inject(cArg);
        break;
      case "new_session":
        res = this.network.newSession();
        this.runNewSessionCommand();
        break;
      default:
        matched = false;
    }

    if (!matched || !res) {
      if (step) {
        this.network.step--;
      }
    } else {
      if (step) {
        this.networkSnapshots.push(this.network.clone());
        this.currentSnapshot++;
      }
    }
  }
}

export { Simulation };
