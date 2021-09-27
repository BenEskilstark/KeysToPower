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
    name: oneOf(config.firstNames) + " " + oneOf(config.lastNames),
    faction,
    title,
    isPlayer: false,
    isLeader: false,

    money: makeValue(0),
    income: 0,

    corruption: makeValue(config[faction].corruption),
    disposition: oneOf(config.dispositions),
    traits: [],
    desires: [],
    skills: [],
    loyalty: makeValue(normalIn(config[faction])),
  };


  // effects of faction

  // effects of title
  if (!title) person.title = oneOf(factionTitles[faction]);

  // effects of disposition

  // effects of traits
  // if (Math.random() < 0.3) {
  //   person.traits.push(oneOf(config.traits));
  // }

  return person;
}

module.exports = {
  makePerson,
};
