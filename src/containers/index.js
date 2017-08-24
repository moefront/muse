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
  }

  componentWillMount() {
    const { layout, playList, id } = this.props,
          { dispatch } = store;
    // register instance
    dispatch(PlayerActions.createPlayerStore({
      playerLayout: layout,
      playList: playList
    }, id));

    // export this instance to window.MUSE
    window.MUSE._instances[id] = this;
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
