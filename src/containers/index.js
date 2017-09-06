// React
import React, { Component } from 'react';
import PropTypes from 'prop-types';
// Mobx
import { observer } from 'mobx-react';
// Container
import UIContainer from './UIContainer';

@observer
export default class PlayerContainer extends Component
{
  static propTypes = {
    playList: PropTypes.array.isRequired,
    layout: PropTypes.string.isRequired
  };

  _store = undefined;

  constructor(props) {
    super(props);

    this._store = props.store;
    if (typeof window != undefined) {
      window.MUSE._instances[props.id] = this;
    }
  }

  componentWillMount() {
    const { layout, playList, id, store } = this.props;
    // register instance
    store.createPlayerInstance({
      playerLayout: layout,
      playList: playList
    }, id);
  }

  render() {
    const { accuracy } = this.props;
    return (
      <UIContainer
        store={ this.props.store.getInstance(this.props.id) }
        id={ this.props.id }
        accuracy={ accuracy ? accuracy : false }
      />
    );
  }
}
