// @flow

const {
  sumFactors, updateSimulatedValue,
} = require('../utils/simulatedValues');
const {config} = require('../config');

const gameReducer = (game, action) => {
  switch (action.type) {
    case 'TICK': {
      const gov = game.government;
      gov.turn += 1;

      // compute government-level resources
      computeGovValues(gov);
      computeGovFactors(gov);

      // compute faction-level resources
      computeAllFactionValues(gov);
      computeAllFactionFactors(gov);

      // compute person-level resources
      computeAllPersonValues(gov);
      computeAllPersonFactors(gov);

      // HACK: prepare coercion and taxes
      if (gov.turn == 1) {
        updateSimulatedValue(gov.coercion);

        let totalTaxes = 0;
        for (const person of gov.population) {
          if (person.faction == 'Workers' || person.faction == 'Business') {
            totalTaxes += person.income * (1 - person.corruption.value) *
              gov.factions[person.faction].taxRate.value;
          }
        }
        gov.money.factors.push({
          value: totalTaxes,
          name: 'Tax Revenue',
        });
      }
      return game;
    }
  }
  return game;
}

////////////////////////////////////////////////////////////
// Government-level
////////////////////////////////////////////////////////////

const computeGovValues = (gov) => {
  updateSimulatedValue(gov.money);
  updateSimulatedValue(gov.coercion);
  updateSimulatedValue(gov.production);
  updateSimulatedValue(gov.land);
  updateSimulatedValue(gov.legitimacy);
};

const computeGovFactors = (gov) => {
  // money
  let totalTaxes = 0;
  for (const person of gov.population) {
    if (person.faction == 'Workers' || person.faction == 'Business') {
      totalTaxes += person.income * (1 - person.corruption.value) *
        gov.factions[person.faction].taxRate.value;
    }
  }
  if (totalTaxes > 0) {
    gov.money.factors.push({
      value: totalTaxes,
      name: 'Tax Revenue',
    });
  }
  let totalSalaries = 0;
  for (const person of gov.population) {
    if (person.faction != 'Workers' && person.faction != 'Business') {
      totalSalaries += person.income;
    }
  }
  if (totalSalaries > 0) {
    gov.money.factors.push({
      value: -1 * totalSalaries,
      name: 'Government Salaries',
    });
  }

  // coercion
  gov.coercion.factors.push({
    value: gov.factions.Army.tanks.value,
    name: 'Army Tanks',
  });
  gov.coercion.factors.push({
    value: gov.factions["Secret Police"].censorship.value,
    name: 'Police Surveillance',
  });

  // production
  gov.production.factors.push({
    value: gov.factions.Business.factories.value * gov.factions.Workers.people.length,
    name: 'Factories x Workers',
  });

  // legitimacy
  gov.legitimacy.factors.push({
    value: gov.factions.Clergy.churches.value,
    name: 'Churches',
  });
  gov.legitimacy.factors.push({
    value: gov.factions.Parliament.land.value,
    name: 'Parliament',
  });
  gov.legitimacy.factors.push({
    value: gov.factions["Secret Police"].propaganda.value,
    name: 'Pro-leader Propaganda',
  });


};

////////////////////////////////////////////////////////////
// Faction-level
////////////////////////////////////////////////////////////

const computeAllFactionValues = (gov) => {
  for (const f in gov.factions) {
    const faction = gov.factions[f];
    for (const resource of config.factionResources) {
      if (faction[resource] == null) continue;
      faction[resource].value += sumFactors(faction[resource].factors);
      faction[resource].factors = [];
    }
  }
};

const computeAllFactionFactors = (gov) => {

};

////////////////////////////////////////////////////////////
// Person-level
////////////////////////////////////////////////////////////

const computeAllPersonValues = (gov) => {
  for (const person of gov.population) {
    updateSimulatedValue(person.money);
    updateSimulatedValue(person.corruption);
    updateSimulatedValue(person.loyalty);
  }
};

const computeAllPersonFactors = (gov) => {

  // money
  for (const person of gov.population) {
    if (person.faction != 'Workers' && person.faction != 'Business') {
      person.money.factors.push({
        value: person.income,
        name: 'Income',
      });
      continue;
    }

    let income = 0;
    if (person.faction == 'Workers') {
      income = gov.factions.Workers.minimumWage.value;
      person.money.factors.push({
        value: income,
        name: 'Income',
      });
    }
    if (person.faction == 'Business') {
      const grossRevenue = gov.factions.Business.factories.value * 10000;
      person.money.factors.push({
        value: grossRevenue,
        name: 'Gross Revenue ($10k / factory)',
      });
      const wages =
        (gov.factions.Workers.people.length / gov.factions.Business.people.length) *
        gov.factions.Workers.minimumWage.value;
      person.money.factors.push({
        value: -1 * wages,
        name: 'Wages (minwage x workers / businessman)',
      });
      income = grossRevenue - wages;
    }
    // need to track the income on the person for easier tax calculation
    // at the gov level
    person.income = income;

    if (person.faction == 'Workers' || person.faction == 'Business') {
      person.money.factors.push({
        value: -1 * person.income * (1 - person.corruption.value)
          * gov.factions[person.faction].taxRate.value,
        name: 'Taxes (after corruption)',
      });
    }

  }

  // loyalty
};

module.exports = {gameReducer}
