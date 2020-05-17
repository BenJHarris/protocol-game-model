import { Set, Map, hash, List } from "immutable";

class Agent {
  constructor(id, factSet, isPlayer = false) {
    this.id = id;
    this.facts = Set(factSet);
    this.uniqueKeyCount = 0;
    this.isPlayer = isPlayer;
  }

  learn(fact) {
    fact.step = this.network.step;
    this.facts = this.facts.add(fact);
  }

  encryptFact(fact, key) {
    if (this.facts.has(fact)) {
      if (key) {
        if (this.facts.has(key)) {
          this.learn(new Fact(fact, true, key));
        } else {
          throw new Error(`Agent ${this.id} does not have key ${key}`);
        }
      } else {
        this.learn(new Fact(fact, true, `${this.id}${this.uniqueKeyCount++}`));
      }
    } else {
      throw new Error(`Agent ${this.id} does not know fact ${fact}`);
    }
  }

  decryptFact(fact, key) {
    if (this.facts.has(fact)) {
      this.learn(fact.decrypt(key));
    }
  }

  sendMessage(fact, agent) {
    if (this.facts.has(fact)) {
      this.network.createMessage(this.id, agent.id, fact);
    }
  }

  clone() {
    return new Agent(
      this.id,
      this.facts.map((f) => f.clone()),
      this.isPlayer
    );
  }
}

export { Agent };
