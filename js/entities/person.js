// @flow

const {config, prototype} = require('../config');
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
    income: prototype[faction].income,

    corruption: makeValue(prototype[faction].corruption),
    disposition: oneOf(config.dispositions),
    traits: [],
    desires: [],
    skills: [],
  };


  // effects of faction
  for (const resource of config.personResources) {
    if (prototype[faction][resource] == null) continue;
    // console.log(faction, resource, prototype[faction], prototype[faction][resource]);
    person[resource] = makeValue(prototype[faction][resource]);
  }

  // effects of title
  if (!title) person.title = oneOf(factionTitles[faction]);
  for (const resource of config.personResources) {
    if (prototype[person.title][resource] == null) continue;
    person[resource] = makeValue(prototype[person.title][resource]);
  }

  // one-off for loyalty
  person.loyalty = makeValue(normalIn(
    prototype[faction].loyalty - 5,
    prototype[faction].loyalty + 5,
  ));
  person.loyalty.isNonCumulative = true;

  // effects of disposition
  // TODO

  // effects of traits
  // if (Math.random() < 0.3) {
  //   person.traits.push(oneOf(config.traits));
  // }

  return person;
}

module.exports = {
  makePerson,
};
