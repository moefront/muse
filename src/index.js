/*eslint no-console:0 */

import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import PlayerContainer from './containers';

const render = (Component, node) => {
  // Render the main component into the dom
  ReactDOM.render(
    <AppContainer>
      {Component}
    </AppContainer>,
    node
  );
};

export const MuseDOM = {
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

  registerLayout(layoutName) {
    this._layouts.push(layoutName);
  },

  registerMiddleware(hook, middleware) {
    if (typeof middleware != 'function') {
      console.error(
        'MUSE has detected an illegal middleware. You may not able to use this middleware hooked at ' +
          hook
      );
      return;
    }
    this._middlewares[hook].push(middleware);
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
