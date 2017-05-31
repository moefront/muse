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
import { connect } from 'react-redux';

// Container
import LyricItemContainer from './LyricItemContainer';
// Actions
import { PlayerActions } from '../actions';
// Utils
import { lyricParser, classifier } from '../utils';
// icons
import { LyricToggler, PlayListToggler } from '../sources/icons';

export class DrawerContainerWithoutStore extends Component
{
  static propTypes = {
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      current: props.player.playList[props.player.currentMusicIndex],
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
    this.unsubscriber = this.props.store.subscribe(this.subscriber);
    this.parseLyric(this.props.player.playList[this.props.player.currentMusicIndex]);
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
          newState = store.getState(),
          current = newState.player.playList[newState.player.currentMusicIndex];
    if (current != this.state.current) {
      this.parseLyric(current);
      this.updateLyricContainerDOMState(0);
    }
  }
  unsubscriber = undefined

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
  toggleDrawerState = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { dispatch } = this.props,
          { isDrawerOpen } = this.props.player;
    dispatch(PlayerActions.toggleDrawer(!isDrawerOpen));
  }

  togglePanel = (panel, e) => {
    e.preventDefault();
    e.stopPropagation();

    const { dispatch } = this.props;
    dispatch(PlayerActions.togglePanel(panel));
  }

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
  parseLyric = (current) => {
    if (current.lyric == undefined) {
      this.setState({
        current,
        lrcComponents: null
      });
      return;
    }

    const lyrics = lyricParser(current.lyric);
    let lrcComponents = [], key = 0, translation = [];
    this.lrcRefs = [];    // reset

    // inject translation if exists
    if (current.translation != undefined) {
      translation = current.translation.split('\n');
    }

    lyrics.lyric.forEach(lyric => {
      lrcComponents.push(
        <LyricItemContainer
          key={ key }
          index={ key++ }
          timeline={ lyric.timeline }
          text={ lyric.text }
          translation={ (translation != []) ? translation[key-1] : undefined  }
        />
      );
    });
    this.setState({
      current: current,
      lrcComponents: lrcComponents
    });
  }

  /**
   * synchronize lyric when time update
   * @param  {Object} obj
   * @return {void}
   */
  synchronizeLyric(obj) {
    const { currentTime } = obj,
          { offset } = this.props.player,
          refs = this.state.lrcComponents;
    let current = currentTime + offset,     // fix timeline offset
        index = Number(this.lrcContainer.getAttribute('data-current-index'));
    if (this.state.lrcComponents == null) {
      return;
    }

    if (index == -1 && current > refs[0].props.timeline) {
      this.updateLyricContainerDOMState(0);
    } else if (index == refs.length - 1) {
      return;
    } else if (index != -1) {
      if (current < refs[index].props.timeline) { // find prev
        for (let i = index; i >= 0; i--)
        {
          if (i == 0) {
            this.updateLyricContainerDOMState(-1);
            break;
          } else if (current >= refs[i].props.timeline && current < refs[i+1].props.timeline) {
            this.updateLyricContainerDOMState(i);
            break;
          } // else if
        } // for
      } else if (current > refs[index+1].props.timeline) {
        for (let i = index; i < refs.length; i ++)
        {
          if (i == refs.length) {
            this.updateLyricContainerDOMState(refs.length);
            break;
          } else if (current >= refs[i].props.timeline
            && refs[i+1]
            && current < refs[i+1].props.timeline) {
            this.updateLyricContainerDOMState(i);
            break;
          } // else if
        } // for
      } // else if
    } // end lyric progress check
    index = Number(this.lrcContainer.getAttribute('data-current-index'));

    // remove active element class
    let currentActive = this.lrcContainer.querySelectorAll('.muse-lyric__item.muse-lyric__state-active'),
        nextActive = this.lrcContainer.querySelector('.muse-lyric__item[data-lyric-item-id="' + index + '"]');
    if (currentActive[0] && currentActive[0] != nextActive) {
      currentActive.forEach ?
      currentActive.forEach(ele => classifier.remove(ele, 'muse-lyric__state-active')) :
      classifier.remove(currentActive[0], 'muse-lyric__state-active');
    }
    if (index != -1 && nextActive != null) {
      classifier.add(nextActive, 'muse-lyric__state-active');
      // change container position
      let boxHeight = this.lrcContainer.offsetHeight,
        targetOffset = nextActive.offsetTop - Math.abs(boxHeight - nextActive.offsetHeight) / 2;
      if (targetOffset < 0) {
        targetOffset = 0;
      }

      let transf = String(targetOffset + 'px');
      this.setTransform(transf);
    }
  }

  updateLyricContainerDOMState(index) {
    this.setTransform('0px');
    this.lrcContainer.setAttribute('data-current-index', index);
  }

  setTransform(transf) {
    this.lrcHold.setAttribute('style', 'transform: translateY(-' + transf + ');'
    + '-webkit-transform: translateY(-' + transf + ');'
    + '-moz-transform: translateY(-' + transf + ');'
    + '-ms-transform: translateY(-' + transf + ');');
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
    const { playList, currentMusicIndex } = this.props.player,
          { dispatch } = this.props;
    let list = [], key = 0;

    const setCurrentMusic = (key, e) => {
      e.preventDefault();
      e.stopPropagation();

      dispatch(PlayerActions.togglePlay(false));
      dispatch(PlayerActions.setCurrentMusic(key));
      setTimeout(() => dispatch(PlayerActions.togglePlay(true)), 0);
    };

    playList.forEach(single => {
      const current = key;
      list.push(
        <div
          className={ 'muse-playList__item' + (key == currentMusicIndex ? ' muse-playList__item-state-playing' : '') }
          key={ key }
          title={ single.title + ' - ' + single.artist }
          onClick={ e => setCurrentMusic(current, e) }
        >
          <span className={ 'muse-playList__item-key' }>{ ++key }</span>
          <span className={ 'muse-playList__item-title' }>{ single.title }</span>
          <span className={ 'muse-playList__item-artist' }>{ single.artist }</span>
        </div>
      );
    });

    return list;
  }

  render() {
    const { isDrawerOpen, currentPanel } = this.props.player;
    return (
      <div
        className={ 'muse-drawer' + (isDrawerOpen ? ' muse-drawer__state-open' : ' muse-drawer__state-close') }
        onClick={ this.toggleDrawerState }
      >
        <div className={ 'position-relative muse-drawer__container'
          + ' muse-drawer__state-' + currentPanel + '-active'
        }>
          <div
            ref={ ref => this.lrcContainer = ref }
            className={ 'muse-drawer__lyric' }
            data-current-index={ -1 }
          >
            <div className={ 'muse-drawer__lyric-container' } ref={ ref => this.lrcHold = ref }>
              { this.state.lrcComponents }
            </div>
          </div>

          <div className={ 'muse-drawer__playList' }>
            { this.renderPlayList() }
          </div>
        </div>

        <div className={ 'muse-drawer__panel-toggler' }>
          <span className={ 'muse-btn__lyric' } onClick={ (e) => this.togglePanel('lyric', e) }>
            <LyricToggler />
          </span>
          
          <span className={ 'muse-btn__playlist'} onClick={ (e) => this.togglePanel('playlist', e) }>
            <PlayListToggler />
          </span>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    player: state.player
  };
})(DrawerContainerWithoutStore);
