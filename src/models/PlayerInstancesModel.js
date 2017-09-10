import { observable, computed, action } from 'mobx';

import PlayerModel from './PlayerModel';
import config from '../config/base';

export default class PlayerInstancesModel {
	@observable players = [];
	@observable latest = config.MUSE_VERSION;

	@computed
	get instancesNumber() {
		return this.players.length;
	}

	get latestVersion() {
		return this.latest;
	}

	@action
	createPlayerInstance(options, id) {
		this.players[id] = new PlayerModel(options, id, this);
	}

	@action
	setLatestVersion(ver) {
		this.latest = ver;
	}

	getInstance(id) {
		return this.players[id];
	}
}
