import { observable, computed, action } from 'mobx';

import PlayerModel from './PlayerModel';
import config from '../config/base';

export class PlayerInstancesModel {
  @observable players: object[] = [];
  @observable latest: string = config.MUSE_VERSION;

  @computed
  get instancesNumber() {
    return this.players.length;
  }

  get latestVersion() {
    return this.latest;
  }

  @action
  createPlayerInstance(options: object, id: any) {
    this.players[id] = new PlayerModel(options, id, this);
  }

  @action
  setLatestVersion(ver: string) {
    this.latest = ver;
  }

  getInstance(id: any): any {
    return this.players[id];
  }
}

export default PlayerInstancesModel;
