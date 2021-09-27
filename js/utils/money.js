// @flow

const {normalIn} = require('../utils/stochastic');
const {config} = require('../config');

const getRandomMoney = (threshold) => {
  return normalIn(
    config[threshold],
    config.upperThresholdMultiplier * config[threshold],
  );
}

module.exports = {
  getRandomMoney,
};
