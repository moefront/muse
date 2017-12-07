import * as React from 'react';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
// interface
import { Item } from '../models/PlayerModel';
// Container
import LyricItemContainer from './LyricItemContainer';
// Utils
import { lyricParser, classifier, applyMiddleware } from '../utils';
// icons
import { LyricToggler, PlayListToggler } from '../sources/icons';

interface DrawerContainerProps {
  id: string | number;
  store?: any;
  parent?: React.Component;
  currentTime: any;
}

interface DrawerContainerState {
  current?: object;
  lrcComponents?: any;
}

@inject('store') @observer
export default class DrawerContainer extends React.Component<DrawerContainerProps, DrawerContainerState> {
  id: string | number = undefined;
  unsubscriber: any = undefined;
  lrcRefs: any = [];
  lrcContainer: HTMLElement;
  lrcHold: HTMLElement;

  constructor(props: DrawerContainerProps) {
    super(props);
    this.id = props.id;
    this.state = {
      current: this.props.store.playList[this.props.store.currentMusicIndex],
      lrcComponents: []
    };
  }

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
  componentWillReceiveProps(nextProps: DrawerContainerProps) {
    this.synchronizeLyric(nextProps);
  }





  subscriber = () => {
    const { store } = this.props,
      newState = store;
    const current = newState.playList[newState.currentMusicIndex];
    if (current !== this.state.current) {
      this.parseLyric(current);
      this.updateLyricContainerDOMState(0);
    }
  };

  toggleDrawerState = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const { store } = this.props;
    store.togglePanel('lyric');
    store.toggleDrawer();
  };

  togglePanel = (panel: string, e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const { store } = this.props;
    store.togglePanel(panel);
  };







  parseLyric = (current: any) => {
    if (!current.lyric && !current.lrc) {
      current.lyric = '[00:00.00]这首歌没有歌词~';
    }

    const lyrics: any = lyricParser(
      current.lyric || current.lrc,
      current.translation
    );
    const lrcComponents: any = [];
    let key = 0;
    this.lrcRefs = []; // reset

    // set lyric offset automatically
    const offset = Number(parseFloat((lyrics.offset / 1000) as any).toFixed(1)),
      curOffset = this.props.store.offset;
    this.props.store.setLyricOffset(Number(offset - curOffset));

    lyrics.lyric.forEach((lyric: any) => {
      lrcComponents.push(
        <LyricItemContainer
          key={(this.id as string) + key}
          index={key++}
          timeline={lyric.timeline}
          text={lyric.text}
          translation={lyric.translation ? lyric.translation : ''}
        />
      );
    });

    this.setState({
      current,
      lrcComponents
    });
  };

  /**
  * synchronize lyric when time update
  * @param  {Object} obj
  * @return {void}
  */
  synchronizeLyric(obj: any) {
    const { currentTime } = obj,
      { offset, instance } = this.props.store,
      refs = this.state.lrcComponents;
    if (!refs) {
      return;
    }

    const current = currentTime + offset; // fix timeline offset
    let index = Number(this.lrcContainer.getAttribute('data-current-index'));
    if (index >= refs.length) {
      index = 0; // reset index
    }

    const prevIndex = index;

    if (
      this.state.lrcComponents === null ||
      this.state.lrcComponents.length === 0
    ) {
      return;
    }

    /* Todo: optimize the complexity */
    if (
      (index === refs.length - 2 && current > refs[index + 1].props.timeline) ||
      index + 1 < refs.length &&
      current > refs[index + 1].props.timeline &&
      index + 2 < refs.length &&
      current < refs[index + 2].props.timeline
    ) {
      this.updateLyricContainerDOMState(++index);
    } else if (index === -1 && current > refs[0].props.timeline) {
      this.updateLyricContainerDOMState(0);
    } else if (index === refs.length - 1) {
      return;
    } else if (index !== -1) {
      if (current < refs[index].props.timeline) {
        // find prev
        for (let i = index; i >= 0; i--) {
          if (i === 0) {
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
          if (i === refs.length) {
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

    if (prevIndex !== index) {
      // remove active element class
      const currentActive = (this.lrcContainer.querySelector(
        '.muse-lyric__item.muse-lyric__state-active'
      ) as HTMLElement),
        nextActive = (this.lrcContainer.querySelector(
          '.muse-lyric__item[data-lyric-item-id="' + index + '"]'
        ) as HTMLElement);
      if (currentActive) {
        classifier.remove(currentActive, 'muse-lyric__state-active');
      }

      if (index !== -1 && nextActive !== null) {
        classifier.add(nextActive, 'muse-lyric__state-active');
        // change container position
        const boxHeight = this.lrcContainer.offsetHeight;
        let targetOffset =
          nextActive.offsetTop -
          Math.abs(boxHeight - nextActive.offsetHeight) / 2;
        if (targetOffset < 0) {
          targetOffset = 0;
        }

        const transf = String(targetOffset + 'px');
        this.setTransform(transf);
      }
      // respond API
      if (index !== -1 && refs[index]) {
        applyMiddleware('onLyricUpdate', instance, {
          timeline: refs[index].props.timeline,
          text: refs[index].props.text,
          translation: refs[index].props.translation
        });
      }
    }
  }

  updateLyricContainerDOMState(index: any) {
    this.setTransform('0px');
    this.lrcContainer.setAttribute('data-current-index', index);
  }

  setTransform(transf: string) {
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






  renderPlayList() {
    const { playList, currentMusicIndex } = this.props.store;
    const list: any = [];
    let key = 0;

    const setCurrentMusic = (idx: number, e: any) => {
      e.preventDefault();
      e.stopPropagation();

      this.props.store.togglePlay(false, this.id);
      this.props.store.setCurrentMusic(idx, this.id);
      setTimeout(() => this.props.store.togglePlay(true), 0);
    };

    playList.forEach((single: Item) => {
      const current = key;
      list.push(
        <div
          className={
            'muse-playList__item' +
            (key === currentMusicIndex
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
