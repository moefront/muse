/*eslint no-console:0 */

import 'core-js/fn/object/assign';
import React from 'react';
import { render as reactDOMRender, unmountComponentAtNode } from 'react-dom';
import { PlayerActions } from './actions';
import PlayerContainer from './containers';

const render = (Component, node) => {
  // Render the main component into the dom
  reactDOMRender(
    Component,
    node
  );
};

export const MuseDOM = {
  // Do not modify them directly.
  _instances: [],

  _layouts: ['muse-layout-default'],

  _middlewares: {
    afterRender: [],

    onMusicChange: [],
    onToggleMenu: [],
    onToggleFullscreen: [],
    onToggleDrawer: [],
    onTogglePlay: [],

    onPlayerResize: []
  },

  actions: PlayerActions,

  /* MUSE Player API start */
  // high-level APIs: dispatchAction(), getInstance(), getReducerState()
  // Warning: these APIs are directly related to Component, you'd better not use them unless you need.
  dispatchAction(id, action) {
    const instance = this.getInstance(id);
    instance._store.dispatch(action);
  },
  getInstance(id) {
    return this._instances[id] ? this._instances[id] : null;
  },
  getReducerState(id, key) {
    const instance = this.getInstance(id);
    return instance._store.getState().player[key];
  },

  // Player action APIs
  // These APIs are connected to PlayerActions. Dispatching all of them should have an ID of player instance.
  play(id) {
    this.dispatchAction(id, this.actions.togglePlay(true));
  },
  pause(id) {
    this.dispatchAction(id, this.actions.togglePlay(false));
  },
  stop(id) {
    this.dispatchAction(id, this.actions.playerStop());
  },

  togglePlay(id) {
    const state = this.getReducerState(id, 'isPlaying');
    this.dispatchAction(id, this.actions.togglePlay(!state));
  },
  toggleLoop(id) {
    const state = this.getReducerState(id, 'isLoop');
    this.dispatchAction(id, this.actions.toggleLoop(!state));
  },
  toggleDrawer(id) {
    const state = this.getReducerState(id, 'idDrawerOpen');
    this.dispatchAction(id, this.actions.toggleDrawer(!state));
  },
  togglePanel(id, panel) {
    this.dispatchAction(id, this.actions.togglePanel(panel));
  },

  setCurrentMusic(id, index) {
    this.dispatchAction(id, this.actions.setCurrentMusic(index));
  },
  setLyricOffset(id, offset) {
    this.dispatchAction(id, this.actions.setLyricOffset(offset));
  },

  addMusicToList(id, item) {
    this.dispatchAction(id, this.actions.addMusicToList(item));
  },
  removeMusicFromList(id, index) {
    this.dispatchAction(id, this.actions.removeMusicFromList(index));
  },
  changePlayerLayout(id, layout) {
    this.dispatchAction(id, this.actions.changePlayerLayout(layout));
  },
  /* MUSE Player API end */

  /* MUSE Player life cycle */
  destroy(id) {
    const parent = document.getElementById(id).parentNode;
    unmountComponentAtNode(parent);
  },

  render(playList, node, options) {
    if (options === undefined || !options.layout) {
      options = {};
      options.layout = 'muse-layout-default';
    }

    const playerID = 'muse-player-' + Date.parse(new Date()),
      props = {
        id: playerID,
        playList,
        ...options
      },
      Component = <PlayerContainer {...props} />;
    let muse = {
      component: Component,
      ref: undefined,
      id: playerID
    };

    if (node !== undefined) {
      render(Component, node);
      muse.ref = document.getElementById(playerID);
    }

    return muse;
  }
};

window.MUSE = window.YMPlayer = MuseDOM;

export PlayerContainer from './containers';
export default MuseDOM;
