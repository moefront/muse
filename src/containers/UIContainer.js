import React, { Component } from 'react';
import { connect } from 'react-redux';

// Actions
import { PlayerActions } from '../actions';

// Containers
import ControlContainer from './ControlContainer';
import SelectorContainer from './SelectorContainer';
import DrawerContainer from './DrawerContainer';
import MenuContainer from './MenuContainer';

// Components
import { Cover, Progress } from '../components';

// Stylus
import '../styles/MUSE.styl';

// Utils
import { applyMiddleware } from '../utils';

export class UIContainerWithoutStore extends Component {
  touchTimer = undefined;

  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      duration: 0
    };
  }

  /* life cycles */
  componentDidMount() {
    const { dispatch } = this.props.store,
      instance = {
        component: this,
        ref: this.player,
        id: this.props.id
      };
    dispatch(PlayerActions.pushPlayerInstance(instance));

    window.addEventListener('resize', this.onWindowResize);

    this.player.addEventListener('contextmenu', this.onPlayerContextMenu);
    this.player.addEventListener('touchstart', this.onMobileTouchStart);
    this.player.addEventListener('touchend', this.onMobileTouchEnd);

    this.unsubscriber = this.props.store.subscribe(this.subscriber);
    applyMiddleware('afterRender', instance);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);

    this.player.removeEventListener('contextmenu', this.onPlayerContextMenu);
    this.player.removeEventListener('touchstart', this.onMobileTouchStart);
    this.player.removeEventListener('touchend', this.onMobileTouchEnd);

    this.unsubscriber();
  }

  /* fullscreen related store subscribers */
  subscriber = () => {
    const getFullscreenState = () => {
      return document.fullscreenElement
        ? true
        : document.webkitFullscreenElement
            ? true
            : document.mozFullscreenElement ? true : false;
    },
      eleFSState = getFullscreenState(),
      { isFullscreen } = this.props.player,
      { player } = this;

    if (eleFSState != isFullscreen && isFullscreen) {
      setTimeout(() => {
        const state = player.requestFullscreen
          ? player.requestFullscreen() || true
          : player.webkitRequestFullscreen
              ? player.webkitRequestFullscreen() || true
              : player.mozRequestFullscreen
                  ? player.mozRequestFullscreen() || true
                  : false;

        if (!state) {
          throw 'It seems that your browser does not support HTML5 Fullscreen Feature.';
        }
      }, 10);
    } else if (eleFSState != isFullscreen && !isFullscreen) {
      document.exitFullscreen
        ? document.exitFullscreen()
        : document.webkitExitFullscreen
            ? document.webkitExitFullscreen()
            : document.mozExitFullscreen ? document.mozExitFullscreen() : '';
    } else {
      return;
    }
  };
  unsubscriber = undefined;

  /* event listeners */
  onMobileTouchStart = e => {
    if (this.props.store.getState().player.isMenuOpen) {
      return;
    }

    this.touchTimer = setTimeout(() => this.onPlayerContextMenu(e), 1000);
  };

  onMobileTouchEnd = () => {
    clearTimeout(this.touchTimer);
  };

  onPlayerContextMenu = e => {
    const { dispatch } = this.props.store;

    e.preventDefault();
    e.stopPropagation();

    dispatch(PlayerActions.toggleMenu(true));

    // set position
    const menuElement = this.player.querySelector('.muse-menu');
    if (!e.touches) {
      menuElement.style.top = e.clientY + 'px';
      menuElement.style.left = e.clientX + 'px';
    } else {
      menuElement.style.top = e.touches[0].clientY + 'px';
      menuElement.style.left = e.touches[0].clientX + 'px';
    }

    // register destroy events
    document.body.addEventListener('click', this.destroyPlayerMenu);
  };

  onWindowResize = e => {
    applyMiddleware('onPlayerResize', this.props.player.instance, e);
  };

  destroyPlayerMenu = e => {
    const { dispatch } = this.props.store;

    e.preventDefault();

    dispatch(PlayerActions.toggleMenu(false));

    document.body.removeEventListener('click', this.destroyPlayerMenu);
  };

  render() {
    const { playList, currentMusicIndex, playerLayout } = this.props.player,
      { id, store } = this.props,
      cover = playList[currentMusicIndex].cover;

    return (
      <div
        className={'muse-player ' + playerLayout}
        id={id}
        ref={ref => (this.player = ref)}
      >
        <Cover cover={cover} />
        <Progress
          currentTime={this.state.currentTime}
          duration={this.state.duration}
          dispatch={this.props.dispatch}
        />

        <SelectorContainer parent={this} />
        <MenuContainer store={store} parent={this} />
        <DrawerContainer store={store} currentTime={this.state.currentTime} />
        <ControlContainer parent={this} store={store} />
      </div>
    );
  }
}

export default connect(state => {
  return {
    player: state.player
  };
})(UIContainerWithoutStore);
