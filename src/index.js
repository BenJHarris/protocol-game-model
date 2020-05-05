import {
  Simulation,
  Network,
  Agent,
  Fact,
  SessionFact,
} from "./SimulationComponents";

function factSetToString(facts) {
  let strFacts = facts.toList().map((f) => f.toString());
  return strFacts.join(" ");
}

export { Simulation, Network, Agent, Fact, SessionFact, factSetToString };
