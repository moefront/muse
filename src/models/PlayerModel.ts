import { observable, action } from 'mobx';
import { applyMiddleware } from '../utils';

export interface Item {
  title: string;
  artist: string;
  cover: string;
  src: string;
  lyric: string;
  translation: string;
}

export class PlayerModel {
  @observable id: any = undefined;

  @observable isPlaying: boolean = false;
  @observable isLoop: boolean = false;
  @observable isDrawerOpen: boolean = false;
  @observable isMenuOpen: boolean = false;
  @observable isFullscreen: boolean = false;

  @observable volume: number = 1;
  @observable offset: number = 0;
  @observable playRate: number = 1;
  @observable duration: any = undefined;
  @observable currentTime: number = 0;
  @observable timeSlider: any = undefined;
  @observable currentPanel: string = 'lyric';

  @observable currentMusicIndex: number = 0;
  @observable currentLyricIndex: number = -1;
  @observable playList: Array<object> = [];
  @observable playerLayout: string = 'muse-layout-default';
  @observable playerInstance: object = undefined;

  @observable parent: object = undefined;
  @observable lang: string = undefined;

  [key: string]: any;

  constructor(options: any, id: any, parent: object) {
    this.id = id;
    this.parent = parent;
    Object.keys(options).forEach((key: any) => (this[key] = options[key]));
  }

  @action
  togglePlay(state: boolean) {
    this.isPlaying = state === undefined ? !this.isPlaying : state;
    applyMiddleware('onTogglePlay', this, {
      isPlaying: this.isPlaying
    });
    return this.isPlaying;
  }

  @action
  toggleLoop(state: boolean) {
    this.isLoop = state === undefined ? !this.isLoop : state;
    return this.isLoop;
  }

  @action
  toggleDrawer(state: boolean) {
    this.isDrawerOpen = state === undefined ? !this.isDrawerOpen : state;
    applyMiddleware('onToggleDrawer', this, {
      isDrawerOpen: this.isDrawerOpen
    });
    return this.isDrawerOpen;
  }

  @action
  toggleMenu(state: boolean) {
    this.isMenuOpen = state === undefined ? !this.isMenuOpen : state;
    applyMiddleware('onToggleMenu', this, {
      isMenuOpen: this.isMenuOpen
    });
    return this.isMenuOpen;
  }

  @action
  toggleFullscreen(state: boolean) {
    this.isFullscreen = state === undefined ? !this.isFullscreen : state;
    applyMiddleware('onToggleFullscreen', this, {
      isFullscreen: this.isFullscreen
    });
    return this.isFullscreen;
  }

  @action
  togglePanel(panel: string) {
    return (this.currentPanel = panel);
  }

  @action
  playerStop() {
    this.isPlaying = false;
    this.currentTime = 0;
  }

  @action
  slideVolume(volume: number) {
    return (this.volume = volume);
  }

  @action
  setLyricOffset(offset: number) {
    return (this.offset += offset);
  }

  @action
  setPlayRate(rate: number) {
    this.playRate = parseFloat(this.playRate as any);
    rate = parseFloat(rate as any);
    if (this.playRate + rate <= 0 || this.playRate + rate >= 4) {
      return false;
    }
    this.playRate = (parseFloat(this.playRate as any + rate).toFixed(1) as any);
  }

  @action
  slideProgress(progress: number) {
    return (this.currentTime = progress);
  }

  @action
  slideTimeOnly(progress: number) {
    return (this.timeSlider = progress);
  }

  @action
  setCurrentMusic(index: number) {
    this.currentMusicIndex = index;
    applyMiddleware('onMusicChange', this, {
      index,
      detail: this.playList[index]
    });
  }

  @action
  addMusicToList(
    item: Item = {
      title: undefined,
      artist: undefined,
      cover: undefined,
      src: undefined,
      lyric: undefined,
      translation: undefined
    }
  ) {
    return (this.playList = [...this.playList, item]);
  }

  @action
  removeMusicFromList(index: number) {
    return (this.playList = [
      this.playList.slice(0, index - 1),
      this.playList.slice(index + 1, this.playList.length)
    ]);
  }

  @action
  changePlayerLayout(layout: string) {
    return (this.playerLayout = layout);
  }

  @action
  pushPlayerInstance(instance: object) {
    return (this.playerInstance = instance);
  }

  @action
  setPlayerLanguage(target: string) {
    return (this.lang = target);
  }
}

export default PlayerModel;
