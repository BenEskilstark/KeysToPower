// @flow

const config = {
  factions: ['Army', 'Secret Police', 'Business', 'Workers', 'Clergy', 'Parliament'],
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
  firstNames: ['Hugo', 'Josef', 'Augusto', 'Fidel', 'George', 'John', 'Karl', 'Adolf'],
  lastNames: [
    'Mao', 'Castro', 'Marx', 'Stalin', 'Tito', 'Bush', 'Johnson', 'Nehru',
    'Ortega', 'Chavez', 'Sandino', 'Morales', 'Chamorro', 'Somoza',
  ],
  dispositions: ['zealot', 'realist', 'moderate', 'idealist', 'radical'],

};

const prototype = {
  Business: {
    moneyThreshold: 'Rich',
    money: config.moneyThresholds['Rich'],

    // information
    loyalty: 0,
    corruption: 30,

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
  Army: {
    moneyThreshold: 'Middle Class',
    money: config.moneyThresholds['Middle Class'],

    // information
    loyalty: 10,
    corruption: 10,

    // resources
    land: 5,
    tanks: 10,

    // finances
    income: 1000,
    costs: -500,
  },
  Clergy: {
    moneyThreshold: 'Poor',
    money: config.moneyThresholds['Poor'],

    // information
    loyalty: 5,
    corruption: 0,

    // resources
    land: 5,
    churches: 1,
    tithe: 10,

    // finances
    costs: -1000,
  },
  Workers: {
    moneyThreshold: 'Dirt Poor',
    money: config.moneyThresholds['Dirt Poor'],

    // information
    loyalty: -5,
    corruption: 0,

    // finances
    income: 1,
    minimumWage: 1,
    taxRate: 0.5,
    workHours: 60,
    costs: -1,

    // resources
    land: 1,
  },
  ["Secret Police"]: {
    moneyThreshold: 'Middle Class',
    money: config.moneyThresholds['Middle Class'],

    // information
    loyalty: 10,
    corruption: 10,

    // resources
    land: 5,
    propaganda: 1,
    censorship: 1,

    // finances
    income: 1000,
    costs: -500,
  },
  Parliament: {
    moneyThreshold: 'Middle Class',
    money: config.moneyThresholds['Middle Class'],

    // information
    loyalty: 5,
    corruption: 10,

    // resources
    land: 5,

    // finances
    income: 1000,
    costs: -500,
  },
};

module.exports = {config, prototype};
