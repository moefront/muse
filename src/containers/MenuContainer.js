import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

// Actions
import { PlayerActions } from '../actions';
// Utils
import { getRect } from '../utils';
// config
import config from '../config/base';

export class MenuContainerWithourStore extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  /* life cycles */
  componentDidMount() {
    this.volume.addEventListener('click', this.onVolumeContainerClick);

    this.increaseOffset.addEventListener('click', this.onIncreaseOffsetClick);
    this.decreaseOffset.addEventListener('click', this.onDecreaseOffsetClick);
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
  }

  /* event listeners */
  onLoopTogglerClick = e => {
    e.stopPropagation();
    const { dispatch } = this.props, { isLoop } = this.props.player;
    dispatch(PlayerActions.toggleLoop(!isLoop));
  };

  onFullscreenTogglerClick = e => {
    e.stopPropagation();
    const { dispatch } = this.props, { isFullscreen } = this.props.player;
    dispatch(PlayerActions.toggleFullscreen(!isFullscreen));
  };

  onVolumeContainerClick = e => {
    e.preventDefault();
    e.stopPropagation();
    const rect = getRect(this.volume),
      { dispatch } = this.props,
      vol = (e.clientX - rect.left) / this.volume.offsetWidth;
    dispatch(PlayerActions.slideVolume(vol > 1 ? 1 : vol));
  };

  onIncreaseOffsetClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.fixLyricOffset(0.5);
  };

  onDecreaseOffsetClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.fixLyricOffset(-0.5);
  };

  onStopClick = e => {
    const { dispatch } = this.props;
    e.preventDefault();
    e.stopPropagation();
    dispatch(PlayerActions.playerStop());
  };

  onDebugModeTogglerClick = () => {
    const { parent } = this.props;
    if (
      confirm(
        '将会开启开发者模式，此模式下会显示更多调试信息并注销右键菜单以方便检查元素，若要重新激活右键菜单只能重新加载页面。\n\n' +
          '确定要进入开发者模式吗？'
      )
    ) {
      parent.player.removeEventListener(
        'contextmenu',
        parent.onPlayerContextMenu
      );
    }
  };

  fixLyricOffset = val => {
    const { dispatch } = this.props, { offset } = this.props.player;
    dispatch(PlayerActions.setLyricOffset(offset + val));
  };

  render() {
    const {
      isMenuOpen,
      isLoop,
      isFullscreen,
      volume,
      offset
    } = this.props.player;
    return (
      <div
        className={'muse-menu' + (!isMenuOpen ? ' muse-menu__state-close' : '')}
      >
        <div
          className={'muse-menu__item'}
          name={'stop'}
          onClick={this.onStopClick}
        >
          <span>停止播放</span>
        </div>
        <div className={'muse-menu__item'} name={'slide-volume'}>
          <div>音量调整</div>
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
                <span
                  className="muse-volume__handle"
                  ref={ref => (this.volumeHanler = ref)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={'muse-menu__item'} name={'fix-lyric-offset'}>
          <div>校正歌词(当前偏移:{offset}s)</div>
          <div className={'muse-menu__offset'}>
            <span ref={ref => (this.increaseOffset = ref)}>
              + 提前 0.5s
            </span>

            <span ref={ref => (this.decreaseOffset = ref)}>
              - 延后 0.5s
            </span>
          </div>
        </div>

        <div
          className={'muse-menu__item'}
          name={'toggle-loop'}
          onClick={this.onLoopTogglerClick}
        >
          <span>
            单曲循环：{isLoop ? '开启' : '关闭'}
          </span>
        </div>

        <div
          className={'muse-menu__item'}
          name={'toggle-fullscreen'}
          onClick={this.onFullscreenTogglerClick}
        >
          <span>
            {isFullscreen ? '退出' : ''}
            全屏模式
          </span>
        </div>

        <div
          className={'muse-menu__item'}
          name={'toggle-debug-mode'}
          onClick={this.onDebugModeTogglerClick}
        >
          <span>开发者模式</span>
        </div>

        <div
          className={'muse-menu__item'}
          onClick={() => {
            window.open('https://github.com/moefront/MUSE');
          }}
        >
          <span>MUSE Player ver.{config.MUSE_VERSION}</span>
        </div>
      </div>
    );
  }
}

export default connect(state => {
  return {
    player: state.player
  };
})(MenuContainerWithourStore);
