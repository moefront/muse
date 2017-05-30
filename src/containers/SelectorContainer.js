import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { PlayerActions } from '../actions';

// Icons
import { PrevButton, NextButton } from '../sources/icons';

export class SelectorContainerWithoutStore extends Component
{
  constructor(props) {
    super(props);
  }

  /* event listeners */
  onPrevButtonClick = () => {
    const { dispatch } = this.props,
          { playList, currentMusicIndex } = this.props.player;

    dispatch(PlayerActions.togglePlay(false));

    if (currentMusicIndex - 1 >= 0) {
      dispatch(PlayerActions.setCurrentMusic(currentMusicIndex - 1));
    } else {
      dispatch(PlayerActions.setCurrentMusic(playList.length - 1));
    }

    setTimeout(() => {
      dispatch(PlayerActions.togglePlay(true));
    }, 0);
  }

  onNextButtonClick = () => {
    const { dispatch } = this.props,
          { playList, currentMusicIndex } = this.props.player;

    dispatch(PlayerActions.togglePlay(false));

    if (currentMusicIndex + 1 < playList.length) {
      dispatch(PlayerActions.setCurrentMusic(currentMusicIndex + 1));
    } else {
      dispatch(PlayerActions.setCurrentMusic(0));
    }

    setTimeout(() => {
      dispatch(PlayerActions.togglePlay(true));
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

export default connect(state => {
  return {
    player: state.player
  };
})(SelectorContainerWithoutStore);
