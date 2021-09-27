// @flow

const sumFactors = (factors) => {
  let sum = 0;
  factors.forEach(f => sum += f.value);
  return sum;
}

const makeValue = (value, initialName: ?string): SimulatedValue => {
  let name = initialName || 'Initial';
  const simulatedValue = {value, factors: [], history: []};
  if (value != 0) {
    simulatedValue.history.push({name: 'Initial', value});
  }
  return simulatedValue;
}

const updateSimulatedValue = (sim: SimulatedValue): void => {
  if (!sim.isNonCumulative) {
    sim.value += sumFactors(sim.factors);
  }

  for (const factor of sim.factors) {
    let alreadySeen = false;
    for (const historical of sim.history) {
      if (factor.name == historical.name) {
        if (sim.isNonCumulative) {
          historical.value = factor.value;
        } else {
          historical.value += factor.value;
        }
        alreadySeen = true;
      }
    }
    if (!alreadySeen) {
      sim.history.push({...factor});
    }
  }
  sim.factors = [];

  if (sim.isNonCumulative) {
    sim.value = sumFactors(sim.history);
  }
};

module.exports = {
  sumFactors,
  makeValue,
  updateSimulatedValue,
}
