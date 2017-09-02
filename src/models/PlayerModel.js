import { observable, action } from 'mobx';

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
		if (state != undefined) {
			return (this.isPlaying = state);
		}
		return (this.isPlaying = !this.isPlaying);
	}

	@action
	toggleLoop(state) {
		if (state != undefined) {
			return (this.isLoop = state);
		}
		return (this.isLoop = !this.isLoop);
	}

	@action
	toggleDrawer(state) {
		if (state != undefined) {
			return (this.isDrawerOpen = state);
		}
		return (this.isDrawerOpen = !this.isDrawerOpen);
	}

	@action
	toggleMenu(state = undefined) {
		if (state != undefined) {
			return (this.isMenuOpen = state);
		}
		return (this.isMenuOpen = !this.isMenuOpen);
	}

	@action
	toggleFullscreen() {
		return (this.isFullscreen = !this.isFullscreen);
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
		return (this.currentMusicIndex = index);
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