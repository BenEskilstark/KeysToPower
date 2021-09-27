// @flow

export type Dollar = number;

export type FactionName =
  'Army' | 'Workers' | 'Secret Police' | 'Clergy' | 'Business' | 'Parliament';
export type Faction = {
  name: FactionName,
  people: Array<Person>,
  land: SimulatedValue,
  tanks: SimulatedValue,
  taxRate: SimulatedValue,
  minimumWage: Dollar,
  workHours: SimulatedValue,
  censorship: SimulatedValue,
  propaganda: SimulatedValue,
  tithe: SimulatedValue,
  churches: SimulatedValue,
  regulation: SimulatedValue,
  factories: SimulatedValue,
};

export type Title =
  'Generalissimo' | 'General' | 'Colonel' |
  'Comrade' | 'Union Leader' | 'Foreman' |
  'Director' | 'Captain' | 'Agent' |
  'Prophet' | 'Cardinal' | 'Priest' |
  'Chairman' | 'CEO' | 'VP' |
  'President' | 'Minister' | 'Representative';
export type Person = {
  name: string,
  faction: Faction,
  title: Title,
  isPlayer: boolean,
  isLeader: boolean,

  // resources
  money: SimulatedValue,
  income: Dollar,
  paidBy: ?Person,

  // personality
  corruption: SimulatedValue,
  disposition: 'zealot' | 'realist' | 'moderate' | 'idealist' | 'radical',
  traits: Array<Trait>,
  favorability: {[FactionName]: number},
  loyalty: number, // favorability to the leader
  desires: Array<Outcome>,
  skills: Array<Skill>,
  // state: 'open revolt' | 'scheming' | 'suspicious' | 'cautious'
  // ^^^ can just be computed based on loyalty?
};

// factors affect various values and are a way to visually break down
// how a value is affected in the UI
export type Factor = {
  name: string,
  value: number,
};
// a SimulatedValue is recomputed every turn by adding the sum of
// its factors to the value
export type SimulatedValue = {
  value: number,
  history: Array<Factor>,
  factors: Array<Factor>,
  isNonCumulative: boolean, // for e.g. coercion -- factors that affect this value
    // each turn are not summed, but rather compared to the history for differences
};

export type Trait =
  'Greedy' | 'Cruel' | 'Generous' | 'Moderate' | 'Aggressive' | 'Competent' | 'Lazy';
// An Outcome is an instruction for changing the State
// Petitions are a bundle of Outcomes that the player can choose to accept or reject
export type Outcome = {
  name: string,
  path: Array<string>,
  value: mixed,
  operation: ?string,
};
export type Petition = {
  name: string,
  owner: Person,
  outcomes: Array<Outcome>,
}
export type Skill = string;

export type Government = {
  leader: Person,
  type: 'Military Junta' | 'People\'s Dictatorship' |
    'Police State' | 'Theocracy' | 'Trade Syndicate' | 'Republic',
  factions: {[FactionName]: Faction},
  population: Array<People>,

  // resources
  money: SimulatedValue, // taxes on workers/business --> most petitions, bribes
  coercion: SimulatedValue,  // army, police --> all petitions, parliament, business, workers
                 // unfavorable to use
  production: SimulatedValue, // workers, business --> army, clergy, and secret police
  legitimacy: SimulatedValue, // clergy, parliament, police (propaganda) --> workers, business
  land: SimulatedValue, // army --> business, clergy

  petitionQueue: Array<Petition>,
  turn: number,
};
