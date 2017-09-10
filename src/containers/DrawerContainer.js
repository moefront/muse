/*
8888888b.                                                  .d8888b.                    888             d8b
888  "Y88b                                                d88P  Y88b                   888             Y8P
888    888                                                888    888                   888
888    888 888d888 8888b.  888  888  888  .d88b.  888d888 888         .d88b.  88888b.  888888  8888b.  888 88888b.   .d88b.  888d888
888    888 888P"      "88b 888  888  888 d8P  Y8b 888P"   888        d88""88b 888 "88b 888        "88b 888 888 "88b d8P  Y8b 888P"
888    888 888    .d888888 888  888  888 88888888 888     888    888 888  888 888  888 888    .d888888 888 888  888 88888888 888
888  .d88P 888    888  888 Y88b 888 d88P Y8b.     888     Y88b  d88P Y88..88P 888  888 Y88b.  888  888 888 888  888 Y8b.     888
8888888P"  888    "Y888888  "Y8888888P"   "Y8888  888      "Y8888P"   "Y88P"  888  888  "Y888 "Y888888 888 888  888  "Y8888  888 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer } from 'mobx-react';

// Container
import LyricItemContainer from './LyricItemContainer';
// Utils
import { lyricParser, classifier, applyMiddleware } from '../utils';
// icons
import { LyricToggler, PlayListToggler } from '../sources/icons';

@observer
export default class DrawerContainer extends Component {
  id = undefined;

  static propTypes = {
    store: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.id = props.id;
    this.state = {
      current: this.props.store.playList[this.props.store.currentMusicIndex],
      lrcComponents: []
    };
  }

  /*
  888 d8b  .d888                                         888
  888 Y8P d88P"                                          888
  888     888                                            888
  888 888 888888 .d88b.        .d8888b 888  888  .d8888b 888  .d88b.
  888 888 888   d8P  Y8b      d88P"    888  888 d88P"    888 d8P  Y8b
  888 888 888   88888888      888      888  888 888      888 88888888
  888 888 888   Y8b.          Y88b.    Y88b 888 Y88b.    888 Y8b.
  888 888 888    "Y8888        "Y8888P  "Y88888  "Y8888P 888  "Y8888
                                            888
                                       Y8b d88P
                                        "Y88P"
                                        */
  componentWillMount() {
    const state = this.props.store;
    this.parseLyric(state.playList[state.currentMusicIndex]);
  }
  componentDidMount() {
    this.unsubscriber = autorun(this.subscriber);
  }
  componentWillUnmount() {
    this.unsubscriber();
  }
  componentWillReceiveProps(nextProps) {
    this.synchronizeLyric(nextProps);
  }

  /*
           888                                                   888                                d8b 888
           888                                                   888                                Y8P 888
           888                                                   888                                    888
  .d8888b  888888 .d88b.  888d888 .d88b.       .d8888b  888  888 88888b.  .d8888b   .d8888b 888d888 888 88888b.   .d88b.  888d888
  88K      888   d88""88b 888P"  d8P  Y8b      88K      888  888 888 "88b 88K      d88P"    888P"   888 888 "88b d8P  Y8b 888P"
  "Y8888b. 888   888  888 888    88888888      "Y8888b. 888  888 888  888 "Y8888b. 888      888     888 888  888 88888888 888
       X88 Y88b. Y88..88P 888    Y8b.               X88 Y88b 888 888 d88P      X88 Y88b.    888     888 888 d88P Y8b.     888
   88888P'  "Y888 "Y88P"  888     "Y8888        88888P'  "Y88888 88888P"   88888P'  "Y8888P 888     888 88888P"   "Y8888  888
   */
  subscriber = () => {
    const { store } = this.props,
      newState = store;
    const current = newState.playList[newState.currentMusicIndex];
    if (current != this.state.current) {
      this.parseLyric(current);
      this.updateLyricContainerDOMState(0);
    }
  };
  unsubscriber = undefined;

  /*
                                      888         888 d8b          888
                                      888         888 Y8P          888
                                      888         888              888
   .d88b.  888  888  .d88b.  88888b.  888888      888 888 .d8888b  888888 .d88b.  88888b.   .d88b.  888d888 .d8888b
  d8P  Y8b 888  888 d8P  Y8b 888 "88b 888         888 888 88K      888   d8P  Y8b 888 "88b d8P  Y8b 888P"   88K
  88888888 Y88  88P 88888888 888  888 888         888 888 "Y8888b. 888   88888888 888  888 88888888 888     "Y8888b.
  Y8b.      Y8bd8P  Y8b.     888  888 Y88b.       888 888      X88 Y88b. Y8b.     888  888 Y8b.     888          X88
   "Y8888    Y88P    "Y8888  888  888  "Y888      888 888  88888P'  "Y888 "Y8888  888  888  "Y8888  888      88888P'
   */
  toggleDrawerState = e => {
    e.preventDefault();
    e.stopPropagation();

    const { store } = this.props;
    store.togglePanel('lyric');
    store.toggleDrawer();
  };

  togglePanel = (panel, e) => {
    e.preventDefault();
    e.stopPropagation();

    const { store } = this.props;
    store.togglePanel(panel);
  };

  /*
  888                  d8b               888                             888 888
  888                  Y8P               888                             888 888
  888                                    888                             888 888
  888 888  888 888d888 888  .d8888b      88888b.   8888b.  88888b.   .d88888 888  .d88b.  888d888
  888 888  888 888P"   888 d88P"         888 "88b     "88b 888 "88b d88" 888 888 d8P  Y8b 888P"
  888 888  888 888     888 888           888  888 .d888888 888  888 888  888 888 88888888 888
  888 Y88b 888 888     888 Y88b.         888  888 888  888 888  888 Y88b 888 888 Y8b.     888
  888  "Y88888 888     888  "Y8888P      888  888 "Y888888 888  888  "Y88888 888  "Y8888  888
           888
      Y8b d88P
      "Y88P"   */
  parseLyric = current => {
    if (current.lyric == undefined && current.lrc == undefined) {
      this.setState({
        current,
        lrcComponents: null
      });
      return;
    }

    const lyrics = lyricParser(
      current.lyric || current.lrc,
      current.translation
    );
    let lrcComponents = [],
      key = 0;
    this.lrcRefs = []; // reset

    // set lyric offset automatically
    const offset = Number(parseFloat(lyrics.offset / 1000).toFixed(1)),
      curOffset = this.props.store.offset;
    this.props.store.setLyricOffset(Number(offset - curOffset));

    lyrics.lyric.forEach(lyric => {
      lrcComponents.push(
        <LyricItemContainer
          key={this.id + key}
          index={key++}
          timeline={lyric.timeline}
          text={lyric.text}
          translation={lyric.translation ? lyric.translation : ''}
        />
      );
    });

    this.setState({
      current: current,
      lrcComponents: lrcComponents
    });
  };

  /**
    * synchronize lyric when time update
    * @param  {Object} obj
    * @return {void}
    */
  synchronizeLyric(obj) {
    const { currentTime } = obj,
      { offset, instance } = this.props.store,
      refs = this.state.lrcComponents;
    let current = currentTime + offset, // fix timeline offset
      index = Number(this.lrcContainer.getAttribute('data-current-index'));
    if (index >= refs.length) {
      index = 0; // reset index
    }

    const prevIndex = index;

    if (
      this.state.lrcComponents == null ||
      this.state.lrcComponents.length == 0
    ) {
      return;
    }

    /* Todo: optimize the complexity */
    if (
      index + 1 < refs.length &&
      current > refs[index + 1].props.timeline &&
      index + 2 < refs.length &&
      current < refs[index + 2].props.timeline
    ) {
      this.updateLyricContainerDOMState(++index);
    } else if (index == -1 && current > refs[0].props.timeline) {
      this.updateLyricContainerDOMState(0);
    } else if (index == refs.length - 1) {
      return;
    } else if (index != -1) {
      if (current < refs[index].props.timeline) {
        // find prev
        for (let i = index; i >= 0; i--) {
          if (i == 0) {
            index = -1;
            break;
          } else if (
            current >= refs[i].props.timeline &&
            current < refs[i + 1].props.timeline
          ) {
            index = i;
            break;
          } // else if
        } // for
        this.updateLyricContainerDOMState(index);
      } else if (current > refs[index + 1].props.timeline) {
        for (let i = index; i < refs.length; i++) {
          if (i == refs.length) {
            index = refs.length;
            break;
          } else if (
            current >= refs[i].props.timeline &&
            refs[i + 1] &&
            current < refs[i + 1].props.timeline
          ) {
            index = i;
            break;
          } // else if
        } // for
        this.updateLyricContainerDOMState(index);
      } // else if
    } // end lyric progress check

    index = Number(this.lrcContainer.getAttribute('data-current-index'));

    if (prevIndex != index) {
      // remove active element class
      let currentActive = this.lrcContainer.querySelector(
        '.muse-lyric__item.muse-lyric__state-active'
      ),
        nextActive = this.lrcContainer.querySelector(
          '.muse-lyric__item[data-lyric-item-id="' + index + '"]'
        );
      if (currentActive)
        classifier.remove(currentActive, 'muse-lyric__state-active');

      if (index != -1 && nextActive != null) {
        classifier.add(nextActive, 'muse-lyric__state-active');
        // change container position
        let boxHeight = this.lrcContainer.offsetHeight,
          targetOffset =
            nextActive.offsetTop -
            Math.abs(boxHeight - nextActive.offsetHeight) / 2;
        if (targetOffset < 0) {
          targetOffset = 0;
        }

        let transf = String(targetOffset + 'px');
        this.setTransform(transf);
      }
      // respond API
      if (index != -1) {
        applyMiddleware('onLyricUpdate', instance, {
          timeline: refs[index].props.timeline,
          text: refs[index].props.text,
          translation: refs[index].props.translation
        });
      }
    }
  }

  updateLyricContainerDOMState(index) {
    this.setTransform('0px');
    this.lrcContainer.setAttribute('data-current-index', index);
  }

  setTransform(transf) {
    this.lrcHold.setAttribute(
      'style',
      'transform: translateY(-' +
        transf +
        ');' +
        '-webkit-transform: translateY(-' +
        transf +
        ');' +
        '-moz-transform: translateY(-' +
        transf +
        ');' +
        '-ms-transform: translateY(-' +
        transf +
        ');'
    );
  }

  /*
                                888
                                888
                                888
  888d888 .d88b.  88888b.   .d88888  .d88b.  888d888
  888P"  d8P  Y8b 888 "88b d88" 888 d8P  Y8b 888P"
  888    88888888 888  888 888  888 88888888 888
  888    Y8b.     888  888 Y88b 888 Y8b.     888
  888     "Y8888  888  888  "Y88888  "Y8888  888
  */
  renderPlayList() {
    const { playList, currentMusicIndex } = this.props.store;
    let list = [],
      key = 0;

    const setCurrentMusic = (key, e) => {
      e.preventDefault();
      e.stopPropagation();

      this.props.store.togglePlay(false, this.id);
      this.props.store.setCurrentMusic(key, this.id);
      setTimeout(() => this.props.store.togglePlay(true), 0);
    };

    playList.forEach(single => {
      const current = key;
      list.push(
        <div
          className={
            'muse-playList__item' +
            (key == currentMusicIndex
              ? ' muse-playList__item-state-playing'
              : '')
          }
          key={key}
          title={single.title + ' - ' + single.artist}
          onClick={e => setCurrentMusic(current, e)}
        >
          <span className={'muse-playList__item-key'}>{++key}</span>
          <span className={'muse-playList__item-title'}>{single.title}</span>
          <span className={'muse-playList__item-artist'}>{single.artist}</span>
        </div>
      );
    });

    return list;
  }

  render() {
    const { isDrawerOpen, currentPanel } = this.props.store;
    return (
      <div
        className={
          'muse-drawer' +
          (isDrawerOpen
            ? ' muse-drawer__state-open'
            : ' muse-drawer__state-close')
        }
        onClick={this.toggleDrawerState}
      >
        <div
          className={
            'position-relative muse-drawer__container' +
            ' muse-drawer__state-' +
            currentPanel +
            '-active'
          }
        >
          <div
            ref={ref => (this.lrcContainer = ref)}
            className={'muse-drawer__lyric'}
            data-current-index={-1}
          >
            <div
              className={'muse-drawer__lyric-container'}
              ref={ref => (this.lrcHold = ref)}
            >
              {this.state.lrcComponents}
            </div>
          </div>

          <div className={'muse-drawer__playList'}>
            {this.renderPlayList()}
          </div>
        </div>

        <div className={'muse-drawer__panel-toggler'}>
          <span
            className={'muse-btn__lyric'}
            onClick={e => this.togglePanel('lyric', e)}
          >
            <LyricToggler />
          </span>

          <span
            className={'muse-btn__playlist'}
            onClick={e => this.togglePanel('playlist', e)}
          >
            <PlayListToggler />
          </span>
        </div>
      </div>
    );
  }
}