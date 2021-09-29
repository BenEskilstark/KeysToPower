// @flow

const React = require('react');
const Button = require('./Components/Button.react');
const Game = require('./Game.react');
// const Lobby = require('./Lobby.react');

import type {State, Action} from '../types';

type Props = {
  state: State, // Game State
  dispatch: (action: Action) => Action,
  store: Object,
  modal: Object,
};

function Main(props: Props): React.Node {
  const {state, modal} = props;
  let content = null;
  if (state.screen === 'LOBBY') {
    content = <Lobby dispatch={props.dispatch} store={props.store} />;
  } else if (state.screen === 'GAME') {
    content = <Game dispatch={props.dispatch} state={state} />;
  }

  return (
    <React.Fragment>
      {content}
      {modal}
    </React.Fragment>
  )
}

function Lobby(props): React.Node {
  return (
    <div>
      <Button
        label="Play"
        onClick={() => {
          props.dispatch({type: 'START', screen: 'GAME'});
          props.dispatch({type: 'TICK'});
        }}
      />
    </div>
  );
}


module.exports = Main;
