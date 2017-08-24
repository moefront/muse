import React, { Component } from 'react';
import { connect } from 'react-redux';
// icons
import { PlayButton, PauseButton } from '../sources/icons';
// actions
import { PlayerActions } from '../actions/';

@connect(
  state => ({
    player: state.player
  })
)
export default class ControlContainer extends Component
{
  id = undefined;

  constructor(props) {
    super(props);
    this.id = props.id;
  }

  /* store subscribers */
  subscriber = () => {
    const { store } = this.props;
    const state = store.getState().player[this.id],
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
      dispatch(PlayerActions.slideProgress(undefined, this.id)); // reset state
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
  onControllerClick = () => {
    const { playerLayout, isDrawerOpen } = this.props.player[this.id],
          { dispatch } = this.props;
    if (playerLayout == 'muse-layout-landscape') {
      dispatch(PlayerActions.toggleDrawer(!isDrawerOpen, this.id));
    }
  }

  onPlayBtnClick = () => {
    const { dispatch } = this.props,
          { isPlaying } = this.props.player[this.id];
    dispatch(PlayerActions.togglePlay(!isPlaying, this.id));
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

  onAudioEnded = (proxy, e, specialCheck = false) => {
    const { isLoop, currentMusicIndex, playList } = this.props.player[this.id],
          { dispatch } = this.props;

    // check loop
    if ((specialCheck || !isLoop) && playList.length-1 > currentMusicIndex) {
      dispatch(PlayerActions.togglePlay(false, this.id));
      dispatch(PlayerActions.setCurrentMusic(currentMusicIndex + 1, this.id));
      setTimeout(() => dispatch(PlayerActions.togglePlay(true, this.id)), 10);
    } else if (!specialCheck && isLoop) {
      dispatch(PlayerActions.slideProgress(0, this.id));
    } else {
      dispatch(PlayerActions.playerStop(this.id));
    }
  }

  onAudioError = () => {
    this.onAudioEnded(false, false, true);
  }

  render() {
    const { isPlaying, playList, currentMusicIndex } = this.props.player[this.id];
    const current = playList[currentMusicIndex];

    return (
      <div
          className={ 'muse-controller' }
          onClick={ this.onControllerClick }
      >
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
