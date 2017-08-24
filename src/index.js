/*eslint no-console:0 */

import 'core-js/fn/object/assign';

import React from 'react';
import { render as reactDOMRender, unmountComponentAtNode } from 'react-dom';

import { PlayerActions } from './actions';
import PlayerContainer from './containers';

import { LandscapeLayoutConstructor } from './utils/LandscapeLayout';

const render = (Component, node) => {
  // Render the main component into the dom
  reactDOMRender(Component, node);
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
    return instance._store.getState().player[id][key];
  },

  // Player action APIs
  // These APIs are connected to PlayerActions. Dispatching all of them should have an ID of player instance.
  play(id) {
    this.dispatchAction(id, this.actions.togglePlay(true, id));
  },
  pause(id) {
    this.dispatchAction(id, this.actions.togglePlay(false, id));
  },
  stop(id) {
    this.dispatchAction(id, this.actions.playerStop(id));
  },

  togglePlay(id) {
    const state = this.getReducerState(id, 'isPlaying');
    this.dispatchAction(id, this.actions.togglePlay(!state, id));
  },
  toggleLoop(id) {
    const state = this.getReducerState(id, 'isLoop');
    this.dispatchAction(id, this.actions.toggleLoop(!state, id));
  },
  toggleDrawer(id) {
    const state = this.getReducerState(id, 'idDrawerOpen');
    this.dispatchAction(id, this.actions.toggleDrawer(!state, id));
  },
  togglePanel(id, panel) {
    this.dispatchAction(id, this.actions.togglePanel(panel, id));
  },

  setCurrentMusic(id, index) {
    this.dispatchAction(id, this.actions.setCurrentMusic(index, id));
  },
  setLyricOffset(id, offset) {
    this.dispatchAction(id, this.actions.setLyricOffset(offset, id));
  },

  addMusicToList(id, item) {
    this.dispatchAction(id, this.actions.addMusicToList(item, id));
  },
  removeMusicFromList(id, index) {
    this.dispatchAction(id, this.actions.removeMusicFromList(index, id));
  },
  changePlayerLayout(id, layout) {
    this.dispatchAction(id, this.actions.changePlayerLayout(layout, id));
  },
  /* MUSE Player API end */

  /* Middleware related */
  registerMiddleware(hook, func) {
    if (!this._middlewares[hook]) return;
    this._middlewares[hook].push(func);
  },

  /* MUSE Player life cycle */
  destroy(id) {
    const parent = document.getElementById(id).parentNode;
    let listLength = this.getReducerState(id, 'playList').length;
    unmountComponentAtNode(parent);
    while (listLength--)
    {
      this.removeMusicFromList(id, 0);
    }
  },

  render(playList, node, options) {
    if (options === undefined || !options.layout) {
      options = {};
      options.layout = 'muse-layout-default';
    }

    const playerID =
      'muse-player-' +
      Date.parse(new Date()) +
      '-' +
      Math.ceil(Math.random() * 233);

    const props = {
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

LandscapeLayoutConstructor();

export PlayerContainer from './containers';
export default MuseDOM;