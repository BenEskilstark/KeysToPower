// @flow

const {config} = require('../config');
const {
  oneOf, randomIn, normalIn,
  weightedOneOf,
} = require('../utils/stochastic');
const {
  randomFaction, factionTitles,
  getInitialFavorability,
} = require('../utils/factions');
const {
  makeValue,
} = require('../utils/simulatedValues');

import type {
  FactionName, Person, Faction, Dollar,
  Title, Outcome, Skill, Petition, State,
} from 'types';

const makePerson = (faction: FactionName, title: ?Title): Person => {
  const person = {
    name: oneOf(['Hugo', 'Josef', 'Augusto', 'Fidel', 'George', 'John', 'Karl', 'Adolf']) +
      " " +
      oneOf([
        'Mao', 'Castro', 'Marx', 'Stalin', 'Tito', 'Bush', 'Johnson', 'Nehru',
        'Ortega', 'Chavez', 'Sandino', 'Morales', 'Chamorro', 'Somoza',
      ]),
    faction,
    title,
    isPlayer: false,
    isLeader: false,

    money: makeValue(0),
    income: 0,

    corruption: makeValue(0),
    disposition: oneOf(['zealot', 'realist', 'moderate', 'idealist', 'radical']),
    traits: [],
    desires: [],
    skills: [],
    // favorability: {
    //   'Army': getInitialFavorability(faction, 'Army'),
    //   'Workers': getInitialFavorability(faction, 'Workers'),
    //   'Secret Police': getInitialFavorability(faction, 'Secret Police'),
    //   'Clergy': getInitialFavorability(faction, 'Clergy'),
    //   'Business': getInitialFavorability(faction, 'Business'),
    //   'Parliament': getInitialFavorability(faction, 'Parliament'),
    // },
    loyalty: makeValue(randomIn(-100, 100)),
  };

  switch (person.disposition) {
    case 'zealot': {

      break;
    }
    case 'realist': {

      break;
    }
    case 'moderate': {

      break;
    }
    case 'idealist': {

      break;
    }
    case 'radical': {

      break;
    }
  }

  if (!title) person.title = oneOf(factionTitles[faction]);
  switch (faction) {
    case 'Army': {
      person.money = makeValue(isMiddleClass());
      person.income = 5000;
      if (Math.random() < 0.5) {
        person.traits.push('Aggressive');
      }
      break;
    }
    case 'Workers': {
      person.money = makeValue(isPoor());
      if (Math.random() < 0.5) {
        person.traits.push('Moderate');
      }
      break;
    }
    case 'Secret Police': {
      person.money = makeValue(isRich());
      person.income = 5000;
      if (Math.random() < 0.5) {
        person.traits.push('Cruel');
      }
      break;
    }
    case 'Clergy': {
      person.money = makeValue(isMiddleClass());
      person.income = 5000;
      if (Math.random() < 0.5) {
        person.traits.push('Generous');
      }
      break;
    }
    case 'Business': {
      person.money = makeValue(isFilthyRich());
      person.corruption.factors.push({
        name: 'Tax Loop Holes',
        value: 0.4,
      });
      if (Math.random() < 0.8) {
        person.traits.push('Greedy');
      }
      break;
    }
    case 'Parliament': {
      person.income = 5000;
      person.money = makeValue(isRich());
      break;
    }
  }
  if (Math.random() < 0.3) {
    person.traits.push(oneOf(config.traits));
  }

  return person;
}

const isFilthyRich = () => {
  return normalIn(1000000, 10000000);
};
const isRich = () => {
  return normalIn(100000, 1000000);
};
const isMiddleClass = () => {
  return randomIn(50000, 200000);
};
const isPoor = () => {
  return randomIn(1000, 30000);
};
const isDirtPoor = () => {
  return randomIn(0, 10000);
};

module.exports = {
  makePerson,
  isFilthyRich,
  isRich,
  isMiddleClass,
  isPoor,
  isDirtPoor,
};
