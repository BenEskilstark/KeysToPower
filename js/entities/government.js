// @flow

const {
  oneOf, randomIn, normalIn,
  weightedOneOf,
} = require('../utils/stochastic');
const {
  makePerson, isFilthyRich, isRich, isMiddleClass,
} = require('../entities/person');
const {
  randomFaction,
} = require('../utils/factions');
const {
  makeValue,
} = require('../utils/simulatedValues');
const {config, prototype} = require('../config');

import type {
  FactionName, Person, Faction, Dollar,
  Title, Outcome, Skill, Petition, State,
} from 'types';

const makeRandomGovernment = () => {
  const faction = randomFaction();
  // const leader = makePerson(faction, config.leadershipTitles[faction]);

  const factions = {
    Army: makeFaction('Army', faction),
    ["Secret Police"]: makeFaction('Secret Police', faction),
    Business: makeFaction('Business', faction),
    Workers: makeFaction('Workers', faction),
    Clergy: makeFaction('Clergy', faction),
    Parliament: makeFaction('Parliament', faction),
  };

  const gov = {
    // leader,
    type: config.governmentTitles[faction],
    factions,
    population: [
      ...factions["Army"].people,
      ...factions["Workers"].people,
      ...factions["Secret Police"].people,
      ...factions["Clergy"].people,
      ...factions["Business"].people,
      ...factions["Parliament"].people,
    ],

    petitionQueue: [
      {
        name: 'Lower Business Taxes',
        description: 'Lower Taxes by 25 % points',
        owner: null,
        outcomes: [
          {
            name: 'Lower Business Taxes',
            path: ['factions', 'Business', 'taxRate', 'factors'],
            value: {name: 'Lower Business Taxes', value: -0.25},
            operation: 'append',
          },
        ],
        rejection: {
          legitimacyCost: 20,
          rejectionOutcomes: [
            {
              name: 'Spend 20 Legitimacy to avoid lowering taxes',
              path: ['legitimacy', 'factors'],
              value: {name: 'Don\'t Lower Business Taxes', value: -20},
              operation: 'append',
            },
          ],
          coercionThreshold: 10,
          coercionOutcomes: [
            // TODO
          ],
        },
      },
    ],
    turn: 0,

    coercion: makeValue(0),
    money: makeValue(config.moneyThresholds['Filthy Rich']),
    production: makeValue(0),
    legitimacy: makeValue(0),
    land: makeValue(100, 'Total National Land'),
  };
  gov.land.factors.push({
    name: 'Army Bases',
    value: -1 * factions["Army"].land.value,
  });
  gov.land.factors.push({
    name: 'Worker\'s Homes',
    value: -1 * factions["Workers"].land.value,
  });
  gov.land.factors.push({
    name: 'Police Headquarters',
    value: -1 * factions["Secret Police"].land.value,
  });
  gov.land.factors.push({
    name: 'Church Grounds',
    value: -1 * factions["Clergy"].land.value,
  });
  gov.land.factors.push({
    name: 'Factories',
    value: -1 * factions["Business"].land.value,
  });
  gov.land.factors.push({
    name: 'Parliament Building',
    value: -1 * factions["Parliament"].land.value,
  });
  gov.coercion.isNonCumulative = true;

  return gov;
};

const makeFaction = (factionName: FactionName, governmentFaction: FactionName): Faction => {
  const isGovernmentFaction = factionName == governmentFaction;

  const faction = {
    name: factionName,
    people: [],
  };
  const titles = config.titles[factionName];

  // set faction resources/finances
  for (const resource of config.factionResources) {
    if (prototype[factionName][resource] == null) continue;
    faction[resource] = makeValue(prototype[factionName][resource]);
  }

  // set faction people
  const leader = makePerson(factionName, titles[0]);
  leader.isLeader = true;
  leader.income *= 2;
  faction.people.push(leader);

  for (let i = 0; i < prototype[factionName].numPeople - 1; i++) {
    faction.people.push(makePerson(factionName, titles[1]));
  }

  // set faction information
  // TODO

  return faction;
};

module.exports = {
  makeRandomGovernment,
};
