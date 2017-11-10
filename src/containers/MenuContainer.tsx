import * as React from 'react';
import { observer } from 'mobx-react';
// Utils
import { getRect, i18n } from '../utils';
// config
import config from '../config/base';

interface MenuContainerProps {
  id?: string | number;
  store: any;
  parent: React.Component | any;
}

@observer
export default class MenuContainer extends React.Component<MenuContainerProps> {
  id: string | number = undefined;

  volume: HTMLElement;
  increaseOffset: HTMLElement;
  decreaseOffset: HTMLElement;
  increasePlayRate: HTMLElement;
  decreasePlayRate: HTMLElement;

  constructor(props: MenuContainerProps) {
    super(props);
    this.id = props.id;
  }

  /* life cycles */
  componentDidMount() {
    this.volume.addEventListener('click', this.onVolumeContainerClick);

    this.increaseOffset.addEventListener('click', this.onIncreaseOffsetClick);
    this.decreaseOffset.addEventListener('click', this.onDecreaseOffsetClick);
    this.increasePlayRate.addEventListener(
      'click',
      this.onIncreasePlayRateClick
    );
    this.decreasePlayRate.addEventListener(
      'click',
      this.onDecreasePlayRateClick
    );
  }
  componentWillUnmount() {
    this.volume.removeEventListener('click', this.onVolumeContainerClick);

    this.increaseOffset.removeEventListener(
      'click',
      this.onIncreaseOffsetClick
    );
    this.decreaseOffset.removeEventListener(
      'click',
      this.onDecreaseOffsetClick
    );

    this.increasePlayRate.removeEventListener(
      'click',
      this.onIncreasePlayRateClick
    );
    this.decreasePlayRate.removeEventListener(
      'click',
      this.onDecreasePlayRateClick
    );
  }

  isDesktop(): boolean {
    const userAgentInfo = navigator.userAgent,
      agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    let flag = true;
    agents.forEach(agent => {
      if (userAgentInfo.indexOf(agent) > 0) {
        flag = false;
        return;
      }
    });
    return flag;
  }

  /* event listeners */
  onLoopTogglerClick = (e: any) => {
    e.stopPropagation();
    const { store } = this.props;
    store.toggleLoop();
  };

  onFullscreenTogglerClick = (e: any) => {
    e.stopPropagation();
    const { store, parent } = this.props;

    // firefox compatibility
    if (parent.player.mozRequestFullScreen) {
      parent.getFullscreenState()
        ? (document as any).mozCancelFullScreen()
        : parent.player.mozRequestFullScreen();
    }

    store.toggleFullscreen();
  };

  onVolumeContainerClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = getRect(this.volume),
      { store } = this.props,
      vol = (e.clientX - rect.left) / this.volume.offsetWidth;
    store.slideVolume(vol > 1 ? 1 : vol);
  };

  onIncreaseOffsetClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.store.setLyricOffset(0.5);
  };

  onDecreaseOffsetClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.store.setLyricOffset(-0.5);
  };

  onIncreasePlayRateClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.store.setPlayRate(0.1);
  };

  onDecreasePlayRateClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.store.setPlayRate(-0.1);
  };

  onStopClick = (e: any) => {
    const { store } = this.props;
    e.preventDefault();
    e.stopPropagation();
    store.playerStop();
  };

  onDebugModeTogglerClick = () => {
    const { parent } = this.props,
      { lang } = this.props.store;
    if (confirm(i18n('devModeAlert', lang))) {
      parent.player.removeEventListener(
        'contextmenu',
        parent.onPlayerContextMenu
      );
      parent.player.removeEventListener(
        'touchstart',
        parent.onMobileTouchStart
      );
      parent.player.removeEventListener(
        'touchend',
        parent.onMobileTouchEnd
      );

      // inject eruda console for mobile devices
      const win: any = window as any;
      if (win.eruda || this.isDesktop()) {
        return;
      }

      const scriptTag: HTMLElement =  document.createElement('script');
      scriptTag.setAttribute('src', 'https://unpkg.com/eruda/eruda.min.js');
      document.body.appendChild(scriptTag);

      win.intv = setInterval(() => {
        if (win.eruda) {
          window.clearInterval(win.intv);
          win.eruda.init();
          console.log('Eruda console has been injected successfully: https://github.com/liriliri/eruda');
        }
      }, 500);
    }
  };

  render() {
    const {
      isMenuOpen,
      isLoop,
      isFullscreen,
      volume,
      playRate,
      offset,
      parent,
      lang
    } = this.props.store;

    return (
      <div
        className={'muse-menu' + (!isMenuOpen ? ' muse-menu__state-close' : '')}
      >
        <div
          className={'muse-menu__item'}
          data-name={'stop'}
          onClick={this.onStopClick}
        >
          <span>{i18n('stop', lang)}</span>
        </div>
        <div className={'muse-menu__item'} data-name={'slide-volume'}>
          <div>{i18n('modulation', lang)}</div>
          <div className={'muse-volume'}>
            <div
              className={'muse-volume__container'}
              ref={ref => (this.volume = ref)}
            >
              <div
                className={'muse-volume__current'}
                style={{
                  width: Number(volume / 1 * 100) + '%'
                }}
              >
                <span className="muse-volume__handle" />
              </div>
            </div>
          </div>
        </div>

        <div className={'muse-menu__item'} data-name={'fix-lyric-offset'}>
          <div>
            {i18n('setLyricOffset', lang)}({i18n('currentLyricOffset', lang)}:{offset}s)
          </div>
          <div className={'muse-menu__offset'}>
            <span ref={ref => (this.increaseOffset = ref)}>
              + {i18n('forward', lang)} 0.5s
            </span>

            <span ref={ref => (this.decreaseOffset = ref)}>
              - {i18n('backward', lang)} 0.5s
            </span>
          </div>
        </div>

        <div className={'muse-menu__item'} data-name={'set-play-rate'}>
          <span>{i18n('playRate', lang)}(x {playRate})</span>
          <span className={'muse-menu__playrate-container'}>
            <a
              href={'#'}
              data-name={'increasePlayRate'}
              ref={ref => (this.increasePlayRate = ref)}
              className={playRate >= 3.9 ? 'muse-menu__playrate-disabled' : ''}
            >
              +
            </a>
            <a
              href={'#'}
              data-name={'decreasePlayRate'}
              ref={ref => (this.decreasePlayRate = ref)}
              className={playRate <= 0.1 ? 'muse-menu__playrate-disabled' : ''}
            >
              -
            </a>
          </span>
        </div>

        <div
          className={'muse-menu__item'}
          data-name={'toggle-loop'}
          onClick={this.onLoopTogglerClick}
        >
          <span>
            {i18n('looping', lang)}：{isLoop ? i18n('enabled', lang) : i18n('disabled', lang)}
          </span>
        </div>

        <div
          className={'muse-menu__item'}
          data-name={'toggle-fullscreen'}
          onClick={this.onFullscreenTogglerClick}
        >
          <span>
            {isFullscreen ? i18n('exit', lang) : ''}
            {i18n('fullscreenMode', lang)}
          </span>
        </div>

        <div
          className={'muse-menu__item'}
          data-name={'toggle-debug-mode'}
          onClick={this.onDebugModeTogglerClick}
        >
          <span>{i18n('devMode', lang)}</span>
        </div>

        <div
          className={'muse-menu__item'}
          onClick={() => {
            window.open('https://github.com/moefront/muse');
          }}
        >
          <span>
            {config.MUSE_VERSION !== parent.latest
              ? i18n('updateAvailable', lang) + '：MUSE ' + parent.latest
              : 'MUSE Player ver.' + config.MUSE_VERSION}
          </span>
        </div>
      </div>
    );
  }
}
