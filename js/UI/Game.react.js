// @flow

const React = require('react');
const Button = require('./Components/Button.react');
const InfoCard = require('./Components/InfoCard.react');
const PetitionModal = require('./PetitionModal.react');
const {displayMoney} = require('../utils/display');
const {config, prototype} = require('../config');
const {sumFactors} = require('../utils/simulatedValues');

function Game(props): React.Node {
  const {state, dispatch} = props;
  const government = state.game.government;

  const factionCards = [];
  for (const f in government.factions) {
    const faction = government.factions[f];
    factionCards.push(<FactionCard key={"faction_" + f} faction={faction} />);
  }
  return (
    <div
      style={{
        height: '100%',
        overflow: 'scroll',
      }}
    >
      <GovernmentCard government={government} dispatch={dispatch} />
      <div
      >
        {factionCards}
      </div>
    </div>
  );
}

function GovernmentCard(props): React.Node {
  const {dispatch} = props;
  const gov = props.government;
  return (
    <InfoCard>
      <div>Government Type: {gov.type}</div>
      <div>Turn: {gov.turn}</div>
      <ValueCard label="Money" value={gov.money} isMoney={true} />
      <ValueCard label="Coercion" value={gov.coercion} />
      <ValueCard label="Production" value={gov.production} />
      <ValueCard label="Legitimacy" value={gov.legitimacy} />
      <ValueCard label="Land" value={gov.land} />
      <Button label="View Next Petition"
        disabled={gov.petitionQueue.length == 0}
        onClick={() => {
          dispatch({type: 'SET_MODAL',
            modal: (<PetitionModal dispatch={dispatch} fromQueue={true}
              government={gov} petition={gov.petitionQueue[0]}
            />)
          });
        }}
      />
      <Button label="Next Turn" onClick={() => dispatch({type: 'TICK'})} />
    </InfoCard>
  );
}

function FactionCard(props): React.Node {
  const {faction} = props;

  const peopleCards = [];
  for (const person of faction.people) {
    peopleCards.push(
      <PersonCard
        key={"person_" + person.name + "_" + person.disposition + "_" + person.loyalty.value}
        person={person}
      />
    );
  }

  const resources = [];
  for (const resource of config.factionResources) {
    if (faction[resource] == null) continue;
    resources.push(
      <ValueCard key={"value_" + faction.name + resource}
        label={resource.charAt(0).toUpperCase() + resource.slice(1)}
        value={faction[resource]}
        isMoney={resource == 'money'}
      />
    )
  }

  return (
    <div
      style={{
        width: 325,
        display: 'inline-block',
        verticalAlign: 'top',
        height: '100%',
      }}
    >
      <InfoCard style={{width: 230, height: 125}} >
        <div>Faction: {faction.name}</div>
        <div>Avg. Loyalty: {faction.loyalty.toFixed(0)}</div>
        {resources}
      </InfoCard>
      <div>
        {peopleCards}
      </div>
    </div>
  );
}

function PersonCard(props) {
  const {person} = props;

  return (
    <div
      className="FactionPerson"
      style={{
        position: 'relative',
      }}
    >
      <img
        width={100}
        height={100}
        src={'img/abstractPortrait.png'}
      />
      <div
        style={{
          width: 100,
          height: 100,
          top: 0,
          position: 'absolute',
          opacity: (Math.abs(person.loyalty.value)) / 100,
          backgroundColor: person.loyalty.value < 0 ? 'red' : 'green',
          zIndex: 2,
        }}
      />
      <InfoCard
        style={{
          width: 205,
        }}
      >
        <div
          style={{
            overflowX: 'clip',
            whiteSpace: 'nowrap',
          }}
        ><b>{person.title}</b>&nbsp;{person.name}</div>
        <ValueCard label="Money" value={person.money} isMoney={true} />
        <ValueCard label="Corruption" value={person.corruption} />
        <div>Disposition: {person.disposition}</div>
        <ValueCard label="Loyalty" value={person.loyalty} />
      </InfoCard>
    </div>
  );
}

function ValueCard(props) {
  const {label, isMoney} = props;
  const {value, factors, history, isNonCumulative} = props.value;

  let color = 'black';
  let valueDelta = sumFactors(factors)
  let isBiggerThanZero = false;
  let isZero = false;
  if (valueDelta > 0) {
    color = 'green';
    isBiggerThanZero = true;
  }
  if (valueDelta == 0) isZero = true;
  if (valueDelta < 0) color = 'red';
  if (isMoney) valueDelta = displayMoney(valueDelta);
  if (isBiggerThanZero) valueDelta = '+' + valueDelta;

  const displayFactors = [];
  for (const factor of factors) {
    displayFactors.push(
      <div key={"factor_" + factor.name}>
        {factor.name}: {isMoney ? displayMoney(factor.value) : factor.value}
      </div>
    );
  }

  const displayHistory = [];
  for (const factor of history) {
    displayHistory.push(
      <div key={"factor_" + factor.name}>
        {factor.name}: {isMoney ? displayMoney(factor.value) : factor.value}
      </div>
    );
  }

  let deltaDisplay = null;
  if (!isZero && !isNonCumulative) {
    deltaDisplay = (
      <span>
        (<span
          className="displayChildOnHover"
          style={{
            position: 'relative',
            color,
          }}
        >
          {valueDelta}
          <div
            className="hidden"
            style={{
              position: 'absolute',
              top: 18,
              left: 36,
              zIndex: 5,
              color: 'black',
              whiteSpace: 'nowrap',
            }}
          >
            <InfoCard >
              {displayFactors}
            </InfoCard>
          </div>
        </span>)
      </span>
    );
  }

  return (
    <div>
      {label}:&nbsp;
      <span
        className="displayChildOnHover"
        style={{
          position: 'relative',
        }}
      >
        {isMoney ? displayMoney(value) : value}&nbsp;
        <div
          className="hidden"
          style={{
            position: 'absolute',
            top: 18,
            left: 36,
            zIndex: 5,
            color: 'black',
            whiteSpace: 'nowrap',
          }}
        >
          <InfoCard >
            {displayHistory}
          </InfoCard>
        </div>
      </span>
      {deltaDisplay}
    </div>
  );
}

module.exports = Game;
