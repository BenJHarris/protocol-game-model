import { Set, Map, hash, List } from "immutable";
import { Agent } from "./Agent";
import { Message } from "./Message";
import { Fact } from "./Fact";

class Network {
  constructor() {
    this.agents = Map();
    this.stack = [];
    this.session = 0;
    this.step = 0;
  }

  addAgent(agent) {
    if (!(agent instanceof Agent)) {
      throw new Error("Tried to add non-agent to network");
    }
    agent.network = this;
    this.agents = this.agents.set(agent.id, agent);
  }

  transmit(id) {
    const message = this.stack[id];

    if (message.status === "transmitted") {
      return false;
    }

    this.agents.get(message.to).learn(message.fact);
    message.status = "transmitted";
    message.step = this.step;
    return true;
  }

  block(id) {
    console.log(`Run block on ${id}`);
    const message = this.stack[id];
    message.status = "blocked";
    message.step = this.step;
  }

  inject(commandStr) {
    console.log(`Run inject with message ${commandStr}`);

    // inject(X -> Y : msg)
    // Parse inject command

    try {
      const splitComm = commandStr.split(":");
      const agentSection = splitComm[0].trim();
      const factSection = splitComm[1].trim();

      const agents = agentSection.split("->");
      const from = this.agents.get(agents[0].trim());
      const to = this.agents.get(agents[1].trim());

      const fact = Fact.FromString(factSection);

      this.createMessage(from.id, to.id, fact, "injected");
    } catch (err) {
      console.error(`Error parsing command: ${commandStr}`);
    }
  }

  newSession() {
    session++;
  }

  receiveMessage(message) {
    message.status = "waiting";
    stack.push(message);
  }

  transmitMessage(message) {
    message.status = "transmitted";
    toAgent.learn(message.fact);
  }

  createMessage(from, to, fact, status = "waiting") {
    this.stack.push(new Message(from, to, fact, status, this.step));
  }

  clone() {
    let cNetwork = new Network();
    this.agents.map((a) => a.clone()).forEach((a) => cNetwork.addAgent(a));
    cNetwork.stack = this.stack.map((m) => m.clone());
    return cNetwork;
  }
}

export { Network };
