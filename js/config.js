// @flow

const config = {
  factions: ['Army', 'Secret Police', 'Business', 'Workers', 'Clergy', 'Parliament'],
  leadershipTitles: {
    Army: 'Generalissimo',
    Workers: 'Comrade',
    ["Secret Police"]: 'Director',
    Clergy: 'Prophet',
    Business: 'Chairman',
    Parliament: 'President',
  },
  titles: {
    Army: ['General', 'Colonel'],
    Workers: ['Union Leader', 'Foreman'],
    ["Secret Police"]: ['Captain', 'Agent'],
    Clergy: ['Cardinal', 'Priest'],
    Business: ['CEO', 'VP'],
    Parliament: ['Minister', 'Representative'],
  },
  governmentTitles: {
    Army: 'Military Junta',
    Workers: 'People\'s Dictatorship',
    ["Secret Police"]: 'Police State',
    Clergy: 'Theocracy',
    Business: 'Trade Syndicate',
    Parliament: 'Republic',
  },
  // traits: ['Greedy', 'Aggressive', 'Cruel', 'Moderate', 'Generous'],

  // resources
  governmentResources: [
    'money', 'production', 'coercion', 'legitimacy', 'land',
  ],
  factionResources: [
    'land', 'tanks', 'taxRate', 'minimumWage', 'workHours', 'censorship',
    'propaganda', 'tithe', 'churches', 'regulation', 'factories',
  ],
  personResources: [
    'money', 'corruption', 'loyalty',
    'income', 'taxRate', 'minimumWage', 'workHours', 'costs',
  ],

  // money
  moneyThresholds: {
    ['Filthy Rich']: 1000000,
    Rich: 100000,
    ["Middle Class": 10000,
    Poor: 1000,
    ["Dirt Poor"]: 100,
  },
  upperThresholdMultiplier: 10,

  // people
  firstNames: [
    'Hugo', 'Josef', 'Augusto', 'Fidel', 'George', 'John', 'Karl', 'Adolf',
    'Pablo', 'Andrew', 'Winston', 'Joshua', 'Dwight', 'Pol', 'Vladimir',
    'Leon', 'Violeta', 'Rosario', 'Elizabeth',
  ],
  lastNames: [
    'Mao', 'Castro', 'Marx', 'Stalin', 'Tito', 'Bush', 'Johnson', 'Nehru',
    'Ortega', 'Chavez', 'Sandino', 'Morales', 'Chamorro', 'Somoza',
    'Chamberlain', 'Churchill', 'Jackson', 'Kennedy', 'Franklin',
    'Truman', 'MacArthur', 'Lenin', 'Trotsky',
  ],
  dispositions: ['zealot', 'realist', 'moderate', 'idealist', 'radical'],

};

const prototype = {
  ///////////////////////////////////////////////////////
  // BUSINESS
  Business: {
    moneyThreshold: 'Rich',
    money: config.moneyThresholds['Rich'],

    // derived information
    loyalty: 0,
    corruption: 30,
    numPeople: 4,

    // resources
    land: 5,
    factories: 1,

    // finances
    income: 10000,
    taxRate: 0.5,
    minimumWage: 1,
    workHours: 60,
    costs: -500,
  },
  CEO: {
    moneyThreshold: 'Filthy Rich',
  },
  VP: {

  },

  ///////////////////////////////////////////////////////
  // ARMY
  Army: {
    moneyThreshold: 'Middle Class',
    money: config.moneyThresholds['Middle Class'],

    // derived information
    loyalty: 10,
    corruption: 10,
    numPeople: 3,

    // resources
    land: 5,
    tanks: 10,

    // finances
    income: 1000,
    costs: -500,
  },
  General: {
    moneyThreshold: 'Rich',
  },
  Colonel: {

  },

  ///////////////////////////////////////////////////////
  // CLERGY
  Clergy: {
    moneyThreshold: 'Poor',
    money: config.moneyThresholds['Poor'],

    // derived information
    loyalty: 5,
    corruption: 0,
    numPeople: 4,

    // resources
    land: 5,
    churches: 1,
    tithe: 10,

    // finances
    costs: -1000,
  },
  Cardinal: {

  },
  Priest: {

  },

  ///////////////////////////////////////////////////////
  // WORKERS
  Workers: {
    moneyThreshold: 'Dirt Poor',
    money: config.moneyThresholds['Dirt Poor'],

    // derived information
    loyalty: -5,
    corruption: 0,
    numPeople: 7,

    // finances
    income: 1,
    minimumWage: 1,
    taxRate: 0.5,
    workHours: 60,
    costs: -1,

    // resources
    land: 1,
  },
  ["Union Leader"]: {
    moneyThreshold: 'Middle Class',
  },
  Foreman: {

  },

  ///////////////////////////////////////////////////////
  // Secret Police
  ["Secret Police"]: {
    moneyThreshold: 'Middle Class',
    money: config.moneyThresholds['Middle Class'],

    // derived information
    loyalty: 10,
    corruption: 10,
    numPeople: 2,

    // resources
    land: 5,
    propaganda: 1,
    censorship: 1,

    // finances
    income: 1000,
    costs: -500,
  },
  Captain: {
    moneyThreshold: 'Filthy Rich',
  },
  Agent: {

  },

  ///////////////////////////////////////////////////////
  // PARLIAMENT
  Parliament: {
    moneyThreshold: 'Middle Class',
    money: config.moneyThresholds['Middle Class'],

    // derived information
    loyalty: 5,
    corruption: 10,
    numPeople: 4,

    // resources
    land: 5,

    // finances
    income: 1000,
    costs: -500,
  },
  Minister: {
    moneyThreshold: 'Rich',
  },
  Representative: {

  },

};

module.exports = {config, prototype};
