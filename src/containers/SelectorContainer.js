import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { PlayerActions } from '../actions';

// Icons
import { PrevButton, NextButton } from '../sources/icons';

@connect(
  state => ({
    player: state.player
  })
)
export default class SelectorContainer extends Component
{
  id = undefined;

  constructor(props) {
    super(props);
    this.id = props.id;
  }

  /* event listeners */
  onPrevButtonClick = () => {
    const { dispatch } = this.props,
          { playList, currentMusicIndex } = this.props.player[this.id];

    dispatch(PlayerActions.togglePlay(false, this.id));

    if (currentMusicIndex - 1 >= 0) {
      dispatch(PlayerActions.setCurrentMusic(currentMusicIndex - 1, this.id));
    } else {
      dispatch(PlayerActions.setCurrentMusic(playList.length - 1, this.id));
    }

    setTimeout(() => {
      dispatch(PlayerActions.togglePlay(true, this.id));
    }, 0);
  }

  onNextButtonClick = () => {
    const { dispatch } = this.props,
          { playList, currentMusicIndex } = this.props.player[this.id];

    dispatch(PlayerActions.togglePlay(false, this.id));

    if (currentMusicIndex + 1 < playList.length) {
      dispatch(PlayerActions.setCurrentMusic(currentMusicIndex + 1, this.id));
    } else {
      dispatch(PlayerActions.setCurrentMusic(0, this.id));
    }

    setTimeout(() => {
      dispatch(PlayerActions.togglePlay(true, this.id));
    }, 0);
  }

  render() {
    return (
      <div className={ 'muse-selector' }>
        <div
          className={ 'muse-selector__prev' }
          title={ '上一首 (Previous)' }
          onClick={ this.onPrevButtonClick }
        >
          <PrevButton />
        </div>
        <div
          className={ 'muse-selector__next' }
          title={ '下一首 (Next)' }
          onClick={ this.onNextButtonClick }
        >
          <NextButton />
        </div>
      </div>
    );
  }
}
