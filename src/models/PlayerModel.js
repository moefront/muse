import { observable, action } from 'mobx';
import { applyMiddleware } from '../utils';

export default class PlayerModel {
	@observable id = undefined;

	@observable isPlaying = false;
	@observable isLoop = false;
	@observable isDrawerOpen = false;
	@observable isMenuOpen = false;
	@observable isFullscreen = false;

	@observable volume = 1;
	@observable offset = 0;
	@observable duration = undefined;
	@observable currentTime = 0;
	@observable currentPanel = 'lyric';

	@observable currentMusicIndex = 0;
	@observable currentLyricIndex = -1;
	@observable playList = [];
	@observable playerLayout = 'muse-layout-default';
	@observable playerInstance = undefined;

	constructor(options, id) {
		this.id = id;
		Object.keys(options).forEach(key => (this[key] = options[key]));
	}

	@action
	togglePlay(state = undefined) {
		this.isPlaying = state == undefined ? !this.isPlaying : state;
		applyMiddleware('onTogglePlay', this, {
			isPlaying: this.isPlaying
		});
		return this.isPlaying;
	}

	@action
	toggleLoop(state = undefined) {
		this.isLoop = state == undefined ? !this.isLoop : state;
		return this.isLoop;
	}

	@action
	toggleDrawer(state = undefined) {
		this.isDrawerOpen = state == undefined ? !this.isDrawerOpen : state;
		applyMiddleware('onToggleDrawer', this, {
			isDrawerOpen: this.isDrawerOpen
		});
		return this.isDrawerOpen;
	}

	@action
	toggleMenu(state = undefined) {
		this.isMenuOpen = state == undefined ? !this.isMenuOpen : state;
		applyMiddleware('onToggleMenu', this, {
			isMenuOpen: this.isMenuOpen
		});
		return this.isMenuOpen;
	}

	@action
	toggleFullscreen(state = undefined) {
		this.isFullscreen = state == undefined ? !this.isFullscreen : state;
		applyMiddleware('onToggleFullscreen', this, {
			isFullscreen: this.isFullscreen
		});
		return this.isFullscreen;
	}

	@action
	togglePanel(panel) {
		return (this.currentPanel = panel);
	}

	@action
	playerStop() {
		this.isPlaying = false;
		this.currentTime = 0;
	}

	@action
	slideVolume(volume) {
		return (this.volume = volume);
	}

	@action
	setLyricOffset(offset) {
		return (this.offset += offset);
	}

	@action
	slideProgress(progress) {
		return (this.currentTime = progress);
	}

	@action
	setCurrentMusic(index) {
		this.currentMusicIndex = index;
		applyMiddleware('onMusicChange', this, {
			index: index,
			detail: this.playList[index]
		});
	}

	@action
	addMusicToList(
		item = {
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
	removeMusicFromList(index) {
		return (this.playList = [
			this.playList.slice(0, index - 1),
			this.playList.slice(index + 1, this.playList.length)
		]);
	}

	@action
	changePlayerLayout(layout) {
		return (this.playerLayout = layout);
	}

	@action
	pushPlayerInstance(instance) {
		return (this.playerInstance = instance);
	}
}