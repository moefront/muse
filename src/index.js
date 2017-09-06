/*eslint no-console:0 */

import 'core-js/fn/object/assign';

import React from 'react';
import { render as reactDOMRender, unmountComponentAtNode } from 'react-dom';

import PlayerContainer from './containers';
import { PlayerInstancesModel } from './models';

// This is an example for custom layouts inside the project.
// Alternatively, you can also requires your layout file outside.
// Read the wiki and find out how to extend your MUSE Player.
import './layouts/landscape/landscape.styl';
import { construct as landscapeLayoutConstructor } from './layouts/landscape/construct';

const store = new PlayerInstancesModel();

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

    onPlayerResize: [],
    onLyricUpdate: []
  },

  /* MUSE Player API start */
  // high-level APIs: getInstance(), getState(), changeState()
  // Warning: these APIs are directly related to Component, you'd better not use them unless you need.
  getInstance(id) {
    return this._instances[id] ? this._instances[id] : null;
  },
  getState(id, key) {
    return store.getInstance(id)[key];
  },
  changeState(id, key, val) {
    return store.getInstance(id)[key] = val;
  },

  // Player action APIs
  // These APIs are connected to PlayerActions. Dispatching all of them should have an ID of player instance.
  play(id) {
    store.getInstance(id).togglePlay(true);
  },
  pause(id) {
    store.getInstance(id).togglePlay(false);
  },
  stop(id) {
    store.getInstance(id).playerStop();
  },

  togglePlay(id) {
    store.getInstance(id).togglePlay();
  },
  toggleLoop(id) {
    store.getInstance(id).toggleLoop();
  },
  toggleDrawer(id) {
    store.getInstance(id).toggleDrawer();
  },
  togglePanel(id, panel) {
    store.getInstance(id).togglePanel(panel);
  },

  setCurrentMusic(id, index) {
    setTimeout(() => store.getInstance(id).togglePlay(false), 0);
    store.getInstance(id).setCurrentMusic(index);
    setTimeout(() => store.getInstance(id).togglePlay(true), 10);
  },
  setLyricOffset(id, offset) {
    store.getInstance(id).setLyricOffset(offset);
  },

  addMusicToList(id, item) {
    store.getInstance(id).addMusicToList(item);
  },

  removeMusicFromList(id, index) {
    store.getInstance(id).removeMusicFromList(index);
  },
  changePlayerLayout(id, layout) {
    store.getInstance(id).changePlayerLayout(layout);
  },
  /* MUSE Player API end */

  /* Middleware related */
  registerLayout(name, construct) {
    this._layouts.push(name);
    construct();
  },
  registerMiddleware(hook, func) {
    if (!this._middlewares[hook]) return;
    this._middlewares[hook].push(func);
  },

  /* MUSE Player life cycle */
  destroy(id, par = undefined) {
    const parent = par == undefined
      ? document.getElementById(id).parentNode
      : par;
    let listLength = this.getState(id, 'playList').length;
    unmountComponentAtNode(parent);
    while (listLength--) {
      this.removeMusicFromList(id, 0);
    }
  },

  render(playList, node, options) {
    if (options === undefined) {
      options = {};
    }

    if (!options.layout) {
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
      Component = <PlayerContainer store={store} {...props} />;
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

// layout register
MuseDOM.registerLayout('muse-layout-landscape', landscapeLayoutConstructor);

export PlayerContainer from './containers';
export default MuseDOM;