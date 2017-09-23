import React, { Component } from 'react';
import { PropTypes } from 'prop-types';

import { autorun } from 'mobx';
import { observer } from 'mobx-react';
// icons
import { PlayButton, PauseButton } from '../sources/icons';

@observer
export default class ControlContainer extends Component {
  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    store: PropTypes.object.isRequired
  };

  id = undefined;

  constructor(props) {
    super(props);
    this.id = props.id;
  }

  /* store subscribers */
  subscriber = () => {
    const { store, parent } = this.props,
      { audio } = this,
      { currentTime, timeSlider, volume, playRate } = store;
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
    if (timeSlider != undefined) {
      // remove listener
      this.audio.removeEventListener('timeupdate', this.onAudioTimeUpdate);
      // update parent state with a virtual ptime
      parent.setState({
        ...parent.state,
        currentTime: timeSlider
      });
      store.slideTimeOnly(undefined);
    }
    if (currentTime != undefined) {
      audio.currentTime = currentTime;
      store.slideProgress(undefined); // reset state
      // rebind listener
      this.audio.addEventListener('timeupdate', this.onAudioTimeUpdate);
    }
    // change volume
    audio.volume = volume;
    // switch playBack rate
    if (audio.playbackRate != playRate) {
      audio.playbackRate = playRate;
    }
  };
  unsubscriber = undefined;

  /* component life cycles */
  componentDidMount() {
    const { accuracy } = this.props;
    this.unsubscriber = autorun(this.subscriber);

    // bind audio timeupdate handler
    if (accuracy) {
      this.intervaler = window.setInterval(
        this.onAudioTimeUpdate,
        accuracy === true ? 80 : accuracy
      );
    } else {
      this.audio.addEventListener('timeupdate', this.onAudioTimeUpdate);
    }
  }

  componentWillUnmount() {
    this.unsubscriber();
    if (this.intervaler) {
      window.clearInterval(this.intervaler);
    } else {
      this.audio.removeEventListener('timeupdate', this.onAudioTimeUpdate);
    }
  }

  /* event listeners */
  onControllerClick = () => {
    const { playerLayout } = this.props.store,
      { store } = this.props;
    if (playerLayout == 'muse-layout-landscape') {
      store.toggleDrawer();
    }
  };

  onPlayBtnClick = () => {
    const { store } = this.props;
    store.togglePlay();
  };

  onAudioTimeUpdate = () => {
    // synchronize play progress
    const { currentTime, duration } = this.audio,
      { parent } = this.props;
    parent.setState({
      ...parent.state,
      currentTime: currentTime,
      duration: duration
    });
  };

  onAudioEnded = (proxy, e, specialCheck = false) => {
    const { store } = this.props,
      { isLoop, currentMusicIndex, playList } = store;

    // check loop
    if ((specialCheck || !isLoop) && playList.length - 1 > currentMusicIndex) {
      setTimeout(() => store.togglePlay(false), 0);
      store.setCurrentMusic(currentMusicIndex + 1);
      setTimeout(() => store.togglePlay(true), 10);
    } else if (!specialCheck && isLoop) {
      store.slideProgress(0);
    } else {
      store.playerStop();
    }
  };

  onAudioError = () => {
    this.onAudioEnded(false, false, true);
  };

  render() {
    const { isPlaying, playList, currentMusicIndex } = this.props.store;
    const current = playList[currentMusicIndex];

    return (
      <div className={'muse-controller'} onClick={this.onControllerClick}>
        <audio
          preload={'no'}
          ref={ref => (this.audio = ref)}
          src={current.src}
          onError={this.onAudioError}
          onEnded={this.onAudioEnded}
        />

        <div className={'muse-controller__container'}>
          <div className={'muse-musicDetail'}>
            <h1 className={'muse-musicDetail__title'} title={current.title}>
              {current.title}

              <small
                className={'muse-musicDetail__artist'}
                title={current.artist}
              >
                {current.artist}
              </small>
            </h1>
          </div>

          <div className={'muse-playControl'}>
            <button className={'muse-btn__play'} onClick={this.onPlayBtnClick}>
              {isPlaying ? <PauseButton /> : <PlayButton />}
            </button>
          </div>
        </div>
      </div>
    );
  }
}