import * as React from 'react';
import { observable, autorun } from 'mobx';
import { observer, inject } from 'mobx-react';

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

interface UIContainerProps {
  id: any;
  store?: any;
  accuracy: any;
}

interface UIContainerState {
  currentTime: number;
  duration: number;
}

interface Document {
  exitFullscreen: () => void;
  mozCancelFullScreen: () => void;
  webkitExitFullscreen: () => void;
  fullscreenElement: () => void;
  mozFullScreenElement: () => void;
  webkitFullscreenElement: () => void;
}


@inject('store')
@observer
export class UIContainer extends React.Component<
  UIContainerProps,
  UIContainerState
> {
  @observable touchTimer: any = undefined;
  id: string | number = undefined;
  player: HTMLElement;

  unsubscriber: any = undefined;

  public constructor(props: UIContainerProps) {
    super(props);
    this.id = props.id;
    this.state = {
      currentTime: 0,
      duration: 0
    };
  }

  render(): JSX.Element {
    const {
        playList,
        currentMusicIndex,
        playerLayout,
        isDrawerOpen,
        coverImage
      } = this.props.store,
      { id, store } = this.props,
      cover = playList[currentMusicIndex].cover;

    const className: string =
      'muse-player ' +
      playerLayout +
      (isDrawerOpen ? ' muse-root__state-drawer-open' : '');

    return (
      <div
        id={id}
        className={className}
        ref={ref => (this.player = ref)}
        data-length={playList.length}
      >
        <Cover cover={coverImage ? coverImage : cover} id={id} />
        <Progress
          currentTime={this.state.currentTime}
          duration={this.state.duration}
          id={id}
        />

        <SelectorContainer parent={this} id={id} />
        <MenuContainer parent={this} id={id} />
        <ControlContainer
          parent={this}
          id={id}
          accuracy={this.props.accuracy}
        />
        <DrawerContainer currentTime={this.state.currentTime} id={id} />
      </div>
    );
  }

  /* life cycles */
  public componentDidMount(): void {
    const { store } = this.props,
      instance = {
        component: this,
        ref: this.player,
        id: this.id
      };
    store.pushPlayerInstance(instance, this.id);

    window.addEventListener('resize', this.onWindowResize);

    this.player.addEventListener('contextmenu', this.onPlayerContextMenu);
    this.player.addEventListener('touchstart', this.onMobileTouchStart);
    this.player.addEventListener('touchend', this.onMobileTouchEnd);
    this.player.addEventListener(
      'webkitfullscreenchange',
      this.onFullscreenChange
    );
    this.player.addEventListener(
      'mozfullscreenchange',
      this.onFullscreenChange
    );

    this.unsubscriber = autorun(this.subscriber);
    applyMiddleware('afterRender', instance);
    applyMiddleware('onPlayerResize', instance);
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.onWindowResize);

    this.player.removeEventListener('contextmenu', this.onPlayerContextMenu);
    this.player.removeEventListener('touchstart', this.onMobileTouchStart);
    this.player.removeEventListener('touchend', this.onMobileTouchEnd);
    this.player.removeEventListener(
      'webkitfullscreenchange',
      this.onFullscreenChange
    );
    this.player.removeEventListener(
      'mozfullscreenchange',
      this.onFullscreenChange
    );

    this.unsubscriber();
  }

  protected getFullscreenState = (): boolean => {
    return (document as any).fullscreenElement
      ? true
      : (document as any).webkitFullscreenElement
        ? true
        : (document as any).mozFullScreenElement ? true : false;
  };

  /* fullscreen related store subscribers */
  protected subscriber = (): void => {
    const eleFSState = this.getFullscreenState(),
      { isFullscreen } = this.props.store,
      { player } = this;

    if (eleFSState !== isFullscreen && isFullscreen) {
      setTimeout(() => {
        const state = player.requestFullscreen
          ? player.requestFullscreen() || true
          : (player as any).webkitRequestFullscreen
            ? (player as any).webkitRequestFullscreen() || true
            : false;
        if (!state && !(player as any).mozRequestFullScreen) {
          console.error(
            'It seems that your browser does not support HTML5 Fullscreen feature.'
          );
        }
      }, 10);
    } else if (eleFSState !== isFullscreen && !isFullscreen) {
      document.exitFullscreen
        ? document.exitFullscreen()
        : (document as any).webkitExitFullscreen
          ? (document as any).webkitExitFullscreen()
          : (document as any).mozCancelFullScreen
            ? (document as any).mozCancelFullScreen()
            : () => false;
    } else {
      return;
    }
  };

  /* event listeners */
  protected onMobileTouchStart = (e: any): void => {
    const state = this.props.store;
    if (state.isMenuOpen) {
      return;
    }

    this.touchTimer = setTimeout(() => this.onPlayerContextMenu(e), 1000);
  };

  protected onMobileTouchEnd = (): void => {
    clearTimeout(this.touchTimer);
  };

  protected onPlayerContextMenu = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
    this.props.store.toggleMenu(true);

    // set position
    const menuElement: any = this.player.querySelector('.muse-menu');
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

  protected onWindowResize = (e: any): void => {
    applyMiddleware('onPlayerResize', this.props.store.playerInstance, e);
  };

  protected onFullscreenChange = (): void => {
    const currentState = this.getFullscreenState(),
      storedState = this.props.store.isFullscreen;
    if (currentState !== storedState) {
      this.props.store.toggleFullscreen(currentState);
    }
  };

  protected destroyPlayerMenu = (e: any): any => {
    e.preventDefault();
    this.props.store.toggleMenu(false);
    document.body.removeEventListener('click', this.destroyPlayerMenu);
  };
}

export default UIContainer;
