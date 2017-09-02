import { observable, computed, action } from 'mobx';

import PlayerModel from './PlayerModel';

export default class PlayerInstancesModel {
	@observable players = [];

	@computed
	get instancesNumber() {
		return this.players.length;
	}

	@action
	createPlayerInstance(options, id) {
		this.players[id] = new PlayerModel(options, id);
	}

	getInstance(id) {
		return this.players[id];
	}
}
