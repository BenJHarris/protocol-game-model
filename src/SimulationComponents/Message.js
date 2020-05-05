import { Set, Map, hash, List } from "immutable";

class Message {
  constructor(from, to, fact, status = "waiting", step = 0) {
    this.from = from;
    this.to = to;
    this.fact = fact;
    this.status = status;
    this.step = step;
  }

  clone() {
    return new Message(this.from, this.to, this.fact, this.status);
  }

  toString() {
    switch (this.status) {
      default:
        return `${this.from} -> ${this.to}, ${this.fact.toString()} - ${
          this.status
        }`;
    }
  }
}

export { Message };
