// @flow

const React = require('react');
const Button = require('./Components/Button.react');
const InfoCard = require('./Components/InfoCard.react');
const Modal = require('./Components/Modal.react');
const {displayMoney} = require('../utils/display');
const {config, prototype} = require('../config');
const {sumFactors} = require('../utils/simulatedValues');

function PetitionModal(props): React.Node {
  const {dispatch, government, petition, fromQueue} = props;

  return (
    <Modal
      title={petition.name}
      body={(
        <div>
          {petition.description}
        </div>
      )}
      buttons={[
        {
          label: 'Reject with Coercion',
          disabled: government.coercion.value < petition.rejection.coercionThreshold,
          onClick: () => {
            dispatch({type: 'DISMISS_MODAL'});
            dispatch({type: 'REJECT_PETITION', petition, fromQueue, withCoercion: true});
          }
        },
        {
          label: 'Reject with Legitimacy',
          disabled: government.legitimacy.value < petition.rejection.legitimacyCost,
          onClick: () => {
            dispatch({type: 'DISMISS_MODAL'});
            dispatch({type: 'REJECT_PETITION', petition, fromQueue, withCoercion: false});
          }
        },
        {
          label: 'Accept Petition',
          onClick: () => {
            dispatch({type: 'DISMISS_MODAL'});
            dispatch({type: 'ACCEPT_PETITION', petition, fromQueue});
          }
        }
      ]}
    />
  );
}

module.exports = PetitionModal;
