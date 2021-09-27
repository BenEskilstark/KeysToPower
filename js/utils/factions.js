// @flow

const {oneOf, randomIn, normalIn, weightedOneOf} = require('../utils/stochastic');
const {config} = require('../config');

const randomFaction = () => oneOf(config.factions);

////////////////////////////////////////////////////////////
// Titles
////////////////////////////////////////////////////////////
const titles = {
  Army: ['General', 'Colonel'],
  Workers: ['Union Leader', 'Foreman'],
  ["Secret Police"]: ['Captain', 'Agent'],
  Clergy: ['Cardinal', 'Priest'],
  Business: ['CEO', 'VP'],
  Parliament: ['Minister', 'Representative'],
};
const factionTitles = (faction) => {
  return titles[faction];
};

const leadershipTitles = {
  Army: 'Generalissimo',
  Workers: 'Comrade',
  ["Secret Police"]: 'Director',
  Clergy: 'Prophet',
  Business: 'Chairman',
  Parliament: 'President',
};
const leadershipTitle = (faction) => {
  return leadershipTitles[faction];
}

const governmentTitles = {
  Army: 'Military Junta',
  Workers: 'People\'s Dictatorship',
  ["Secret Police"]: 'Police State',
  Clergy: 'Theocracy',
  Business: 'Trade Syndicate',
  Parliament: 'Republic',
}
const governmentTitle = (faction) => {
  return governmentTitles[faction];
}

////////////////////////////////////////////////////////////
// Favorability
////////////////////////////////////////////////////////////

// how does factionA feel about factionB?
const favorabilityMatrix = {
  'Army': [100, 0, 10, 10, 0, 0],
  Workers: [0, 100, -20, -20, 0],
  ["Secret Police"]: [-10, -20, 100, 0, 0, -10],
  Clergy: [0, 20, 0, 0, 0],
  Business: [10, -10, 10, 0, 100, -10],
  Parliament: [0, 0, 0, 0, 0, 100],
};
const getInitialFavorability = (factionA, factionB) => {
  const val = favorabilityMatrix[factionA][factionB];
  return val;
  // return normalIn(val - 10, val + 10);
}



module.exports = {
  randomFaction,
  factionTitles,
  leadershipTitle,
  governmentTitle,
  getInitialFavorability,
};
