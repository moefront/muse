import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import {  autorun } from 'mobx';
import { observer } from 'mobx-react';
// icons
import { PlayButton, PauseButton } from '../sources/icons';

@observer
export default class ControlContainer extends Component
{
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    store: PropTypes.object.isRequired
  };

  id = undefined;

  constructor(props) {
    super(props);
    this.id = props.id;
  }

  /* store subscribers */
  subscriber = () => {
    const { store } = this.props,
      { audio } = this,
      { currentTime, volume } = store;
    // toggle play
    if (!audio.paused != store.isPlaying) {
      if (store.isPlaying) {
        audio.play();
      } else {
        audio.pause();
      }
      return;
    }
    // slide progress
    if (currentTime != undefined) {
      audio.currentTime = currentTime;
      store.slideProgress(undefined); // reset state
    }

    // change volume
    audio.volume = volume;
  }
  unsubscriber = undefined

  /* component life cycles */
  componentDidMount() {
    this.unsubscriber = autorun(this.subscriber);
  }

  componentWillUnmount() {
    this.unsubscriber();
  }

  /* event listeners */
  onControllerClick = () => {
    const { playerLayout } = this.props.store,
          { store } = this.props;
    if (playerLayout == 'muse-layout-landscape') {
      store.toggleDrawer();
    }
  }

  onPlayBtnClick = () => {
    const { store } = this.props;
    store.togglePlay();
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
    const { store } = this.props,
      { isLoop, currentMusicIndex, playList } = store;

    // check loop
    if ((specialCheck || !isLoop) && playList.length-1 > currentMusicIndex) {
      store.setCurrentMusic(currentMusicIndex + 1);
    } else if (!specialCheck && isLoop) {
      store.slideProgress(0);
    } else {
      store.playerStop();
    }
  }

  onAudioError = () => {
    this.onAudioEnded(false, false, true);
  }

  render() {
    const { isPlaying, playList, currentMusicIndex } = this.props.store;
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
