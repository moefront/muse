import React, { Component } from 'react';
import { connect } from 'react-redux';
// icons
import { PlayButton, PauseButton } from '../sources/icons';
// actions
import { PlayerActions } from '../actions/';

export class ControlContainerWithoutStore extends Component
{
  constructor(props) {
    super(props);
  }

  /* store subscribers */
  subscriber = () => {
    const { store } = this.props;
    const state = store.getState().player,
          { dispatch } = this.props,
          { audio } = this;

    // toggle play
    if (!audio.paused != state.isPlaying) {
      if (state.isPlaying) {
        setTimeout(() => audio.play(), 0);
      } else {
        setTimeout(() => audio.pause(), 0);
      }
      return;
    }

    // slide progress
    if (state.currentTime != undefined) {
      audio.currentTime = state.currentTime;
      dispatch(PlayerActions.slideProgress(undefined)); // reset state
    }

    // change volume
    audio.volume = state.volume;
  }
  unsubscriber = undefined

  /* component life cycles */
  componentWillMount() {
    this.unsubscriber = this.props.store.subscribe(this.subscriber);
  }

  componentWillUnmount() {
    this.unsubscriber();
  }

  /* event listeners */
  onPlayBtnClick = () => {
    const { dispatch } = this.props,
          { isPlaying } = this.props.player;
    dispatch(PlayerActions.togglePlay(!isPlaying));
  }

  onAudioTimeUpdate = () => {
    // synchronize play progress
    const { currentTime, duration } = this.audio,
          { parent } = this.props;
    parent.setState({
      ...parent.state,
      currentTime: currentTime,
      duration: duration
    });
  }

  onAudioEnded = (specialCheck = false) => {
    const { isLoop, currentMusicIndex, playList } = this.props.player,
          { dispatch } = this.props;
    // check loop play
    if ((specialCheck || !isLoop) && playList.length-1 > currentMusicIndex) {
      dispatch(PlayerActions.togglePlay(false));
      dispatch(PlayerActions.setCurrentMusic(currentMusicIndex + 1));
      setTimeout(() => dispatch(PlayerActions.togglePlay(true)), 10);
    } else if (!specialCheck && isLoop) {
      dispatch(PlayerActions.slideProgress(0));
    } else {
      dispatch(PlayerActions.playerStop());
    }
  }

  onAudioError = () => {
    this.onAudioEnded(true);
  }

  render() {
    const { isPlaying, playList, currentMusicIndex } = this.props.player;
    const current = playList[currentMusicIndex];

    return (
      <div className={ 'muse-controller' }>
        <audio
          preload={ 'no' }
          ref={ ref => this.audio = ref }
          src={ current.src }

          onTimeUpdate={ this.onAudioTimeUpdate }
          onError={ this.onAudioError }
          onEnded={ this.onAudioEnded }
        >
        </audio>

        <div className={ 'muse-controller__container' }>
          <div className={ 'muse-musicDetail' } >
            <h1 className={ 'muse-musicDetail__title' } title={ current.title }>
              { current.title }

              <small className={ 'muse-musicDetail__artist' } title={ current.artist }>
                { current.artist }
              </small>
            </h1>
          </div>

          <div className={ 'muse-playControl' }>
            <button
              className={ 'muse-btn__play' }
              onClick={ this.onPlayBtnClick }
            >
              { isPlaying ? <PauseButton /> : <PlayButton /> }
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    player: state.player
  };
})(ControlContainerWithoutStore);
