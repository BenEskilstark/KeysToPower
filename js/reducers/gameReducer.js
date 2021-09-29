// @flow

const {
  sumFactors, updateSimulatedValue,
} = require('../utils/simulatedValues');
const {config, prototype} = require('../config');

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
            totalTaxes += computeTaxLoad(gov, person);
          }
        }
        gov.money.factors.push({
          value: totalTaxes,
          name: 'Tax Revenue',
        });
      }
      return game;
    }
    case 'REJECT_PETITION': {
      const {petition, withCoercion, fromQueue} = action;
      let outcomes = petition.rejection.rejectionOutcomes;
      if (withCoercion) {
        outcomes = petition.rejection.coercionOutcomes;
      }
      for (const outcome of outcomes) {
        applyOutcome(game.government, outcome);
      }
      if (fromQueue) {
        game.government.petitionQueue.shift();
      }
      return game;
    }
    case 'ACCEPT_PETITION': {
      const {petition, fromQueue} = action;
      for (const outcome of petition.outcomes) {
        applyOutcome(game.government, outcome);
      }
      console.trace(game.goverment);
      if (fromQueue) {
        game.government.petitionQueue.shift();
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
  for (const resource of config.governmentResources) {
    updateSimulatedValue(gov[resource]);
  }
};

const computeGovFactors = (gov) => {
  // money
  let totalTaxes = 0;
  for (const person of gov.population) {
    if (person.faction == 'Workers' || person.faction == 'Business') {
      totalTaxes += computeTaxLoad(gov, person);
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
    if (
      person.faction != 'Workers' &&
      person.faction != 'Business' &&
      person.income != null
    ) {
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
      updateSimulatedValue(faction[resource]);
    }
  }
};

const computeAllFactionFactors = (gov) => {
  // rederive informational values
  for (const f in gov.factions) {
    const faction = gov.factions[f];
    // loyalty
    let sum = 0;
    for (const person of faction.people) {
      sum += person.loyalty.value;
    }
    faction.loyalty = sum / faction.people.length;
  }
};

////////////////////////////////////////////////////////////
// Person-level
////////////////////////////////////////////////////////////

const computeAllPersonValues = (gov) => {
  for (const person of gov.population) {
    for (const resource of config.personResources) {
      updateSimulatedValue(person[resource]);
    }
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
        value: -1 * computeTaxLoad(gov, person),
        name: 'Taxes (after corruption)',
      });
    }

  }

  // loyalty
};

////////////////////////////////////////////////////////////
// Helpers
////////////////////////////////////////////////////////////

const computeTaxLoad = (gov, person): number => {
  return person.income *
    (1 - person.corruption.value / 100) *
    gov.factions[person.faction].taxRate.value;
};

const applyOutcome = (gov, outcome): void => {
  const {path, value, operation} = outcome;
  let obj = gov;
  for (let i = 0; i < path.length; i++) {
    const p = path[i];
    if (p == null) break; // don't apply upgrade if it doesn't have a valid path

    // apply outcome
    if (i == path.length - 1) {
      if (operation == 'append') {
        obj[p].push(value);
      } else if (operation == 'multiply') {
        obj[p] *= value;
      } else if (operation == 'add') {
        obj[p] += value;
      } else {
        obj[p] = value;
      }
    }

    obj = obj[p];
  }
};

module.exports = {gameReducer}
