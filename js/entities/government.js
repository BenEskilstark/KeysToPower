// @flow

const {
  oneOf, randomIn, normalIn,
  weightedOneOf,
} = require('../utils/stochastic');
const {
  makePerson, isFilthyRich, isRich, isMiddleClass,
} = require('../entities/person');
const {
  randomFaction, factionTitles,
  leadershipTitle, governmentTitle,
} = require('../utils/factions');
const {
  makeValue,
} = require('../utils/simulatedValues');
const {config} = require('../config');

import type {
  FactionName, Person, Faction, Dollar,
  Title, Outcome, Skill, Petition, State,
} from 'types';

const makeRandomGovernment = () => {
  const faction = randomFaction();
  const leader = makePerson(faction, leadershipTitle(faction));
  leader.money = isFilthyRich();

  const factions = {
    Army: makeFaction('Army', faction),
    ["Secret Police"]: makeFaction('Secret Police', faction),
    Business: makeFaction('Business', faction),
    Clergy: makeFaction('Clergy', faction),
    Parliament: makeFaction('Parliament', faction),
    Workers: makeFaction('Workers', faction),
  };

  const gov = {
    leader,
    type: governmentTitle(faction),
    factions,
    population: [
      ...factions["Army"].people,
      ...factions["Workers"].people,
      ...factions["Secret Police"].people,
      ...factions["Clergy"].people,
      ...factions["Business"].people,
      ...factions["Parliament"].people,
    ],

    petitionQueue: [],
    turn: 0,

    coercion: makeValue(0),
    money: makeValue(isFilthyRich()),
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

const makeFaction = (name: FactionName, governmentFaction: FactionName): Faction => {
  const isGovernmentFaction = name == governmentFaction;

  const faction = {
    name,
    people: [],
    land: 0,
  };
  const titles = factionTitles(name);
  let leadershipNumA = 1;
  let leadershipNumB = 3;

  switch (name) {
    case 'Army': {
      faction.tanks = randomIn(5, 50);
      faction.land = 5;
      if (isGovernmentFaction) {
        faction.tanks += 30;
      }

      // leadershipNumA = randomIn(1,3);
      leadershipNumB = randomIn(3,6);
      break;
    }
    case 'Workers': {
      faction.taxRate = 0.5;
      faction.minimumWage = 100;
      faction.workHours = 60;

      // leadershipNumA = randomIn(5,8);
      leadershipNumB = randomIn(5,8);
      faction.land = leadershipNumA + leadershipNumB;
      break;
    }
    case 'Secret Police': {
      faction.surveillance = randomIn(0, 20);
      faction.propaganda = randomIn(0, 10);
      faction.land = 5;

      // leadershipNumA = 1;
      leadershipNumB = randomIn(2,3);
      break;
    }
    case 'Clergy': {
      faction.tithe = isGovernmentFaction ? 0.4 : 0.1;
      faction.churches = 1;
      faction.land = 10;

      // leadershipNumA = randomIn(1,3);
      leadershipNumB = randomIn(3,6);
      break;
    }
    case 'Business': {
      faction.taxRate = isGovernmentFaction ? 0.1 : 0.25;
      faction.regulation = isGovernmentFaction ? 0 : 10;
      faction.land = 5;
      faction.factories = 1;

      // leadershipNumA = randomIn(3,5);
      leadershipNumB = randomIn(2,5);
      break;
    }
    case 'Parliament': {
      // leadershipNumA = 1;
      leadershipNumB = randomIn(4,8);
      faction.land = 5;
      break;
    }
  }

  for (let i = 0; i < leadershipNumA; i++) {
    const leader = makePerson(name, titles[0]);
    leader.isLeader = true;
    leader.income *= 2;
    faction.people.push(leader);
  }
  for (let i = 0; i < leadershipNumB; i++) {
    faction.people.push(makePerson(name, titles[1]));
  }

  for (const resource of config.factionResources) {
    if (faction[resource] == null) continue;
    faction[resource] = makeValue(faction[resource]);
  }
  return faction;
};

module.exports = {
  makeRandomGovernment,
};
