// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Redux
import { Provider } from 'react-redux';
import { configureStore } from '../stores';

import { PlayerActions } from '../actions';

import UIContainer from './UIContainer';

const store = configureStore();

export default class PlayerContainer extends Component
{
  static propTypes = {
    playList: PropTypes.array.isRequired,
    layout: PropTypes.string.isRequired
  };

  _store = store;

  constructor(props) {
    super(props);

    const { layout, playList } = props,
          { dispatch } = store;

    // ADD_MUSIC_TO_LIST
    playList.forEach(single => {
      dispatch(PlayerActions.addMusicToList(single));
    });
    // CHANGE_PLAYER_LAYOUT
    dispatch(PlayerActions.changePlayerLayout(layout));

    // export this instance to window.MUSE
    window.MUSE._instances[this.props.id] = this;
  }

  render() {
    return (
      <Provider store={ store }>
        <UIContainer
          store={ store }
          id={ this.props.id }
        />
      </Provider>
    );
  }
}
