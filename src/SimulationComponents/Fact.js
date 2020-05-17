import { Set, Map, hash, List } from "immutable";

class Fact {
  constructor(data, encrypted = false, decryptionKey, step = 0) {
    this.data = data;
    this.encrypted = encrypted;
    this.decryptionKey = decryptionKey;
    this.step = step;
  }

  static FromString(factString) {
    const openBraceIndex = factString.indexOf("{");
    const closeBraceIndex = factString.lastIndexOf("}");

    if (openBraceIndex > -1 && closeBraceIndex > -1) {
      return new Fact(
        parseFact(factString.slice(openBraceIndex + 1, closeBraceIndex)),
        true,
        factString.slice(closeBraceIndex + 1)
      );
    } else {
      return new Fact(factString);
    }
  }

  decrypt(key) {
    if (this.decryptionKey === key) {
      return this.data;
    } else {
      throw new Error("Incorrect decryption Key");
    }
  }

  clone() {
    return new Fact(
      this.data instanceof Fact ? this.data.clone() : this.data,
      this.encrypted,
      this.decryptionKey,
      this.step
    );
  }

  equals(fact) {
    if (!(fact instanceof Fact)) return false;
    if (
      this.encrypted == fact.encrypted &&
      this.decryptionKey == fact.decryptionKey
    ) {
      if (this.data instanceof Fact) {
        return this.data.equals(fact.data);
      } else {
        return this.data === fact.data;
      }
    } else {
      return false;
    }
  }

  hashCode() {
    let dataHash =
      this.data instanceof Fact ? this.data.hashCode() : hash(this.data);

    const prime = 31;
    let result = 1;
    result = prime * result + dataHash;
    result = prime * reuslt + hash(this.encrypted);
    result = prime * result + hash(this.decryptionKey);
    return result;
  }

  toString() {
    if (!this.encrypted) return this.data;
    return `{${this.data.toString()}}${this.decryptionKey}`;
  }
}

class SessionFact extends Fact {
  constructor(data, encrypted = false, decryptionKey, session) {
    super(data, encrypted, decryptionKey);
    this.session = session;
  }

  equals(sessionFact) {
    return (
      sessionFact instanceof SessionFact &&
      super.equals(sessionFact) &&
      this.session === sessionFact.session
    );
  }

  hashcode() {
    const prime = 31;
    return prime * super.hashcode() + hash(session);
  }

  toString() {
    if (!this.encrypted) return `this.data_${session}`;
    return `{${this.data.toString()}_${session}}${this.decryptionKey}`;
  }
}

export { Fact, SessionFact };
