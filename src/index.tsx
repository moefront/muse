import 'core-js/fn/object/assign';
/* React */
import * as React from 'react';
import { render as reactDOMRender, unmountComponentAtNode } from 'react-dom';
/* honoka library for fetch() polyfill */
import honoka from 'honoka';
/* Player core */
import PlayerContainer from './containers';
import { PlayerInstancesModel, Item } from './models';
import config from './config/base';

// This is an example for custom layouts inside the project.
// Alternatively, you can also requires your layout file outside.
// Read the wiki and find out how to extend your MUSE Player.
import './layouts/landscape/landscape.styl';
import { construct as landscapeLayoutConstructor } from './layouts/landscape/construct';

const store = new PlayerInstancesModel();

const render = (Component: React.ReactElement<any>, node: Element): void => {
  // Render the main component into the dom
  reactDOMRender(Component, node);
};

export const MuseDOM: any = {
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

  _version: config.MUSE_VERSION,
  _public: {
    React,
    honoka
  },

  /* MUSE Player API start */
  // high-level APIs: getInstance(), getState(), changeState()
  // Warning: these APIs are directly related to Component, you'd better not use them unless you need.
  getInstance(id: string | number) {
    return this._instances[id] ? this._instances[id] : null;
  },
  getState(id: string | number, key: string) {
    return store.getInstance(id)[key];
  },
  changeState(id: string | number, key: string, val: any) {
    return (store.getInstance(id)[key] = val);
  },

  // Player action APIs
  // These APIs are connected to PlayerActions. Dispatching all of them should have an ID of player instance.
  play(id: string | number) {
    (store.getInstance(id) as any).togglePlay(true);
  },
  pause(id: string | number) {
    store.getInstance(id).togglePlay(false);
  },
  stop(id: string | number) {
    store.getInstance(id).playerStop();
  },

  togglePlay(id: string | number) {
    store.getInstance(id).togglePlay();
  },
  toggleLoop(id: string | number) {
    store.getInstance(id).toggleLoop();
  },
  toggleDrawer(id: string | number) {
    store.getInstance(id).toggleDrawer();
  },
  togglePanel(id: string | number, panel: string) {
    store.getInstance(id).togglePanel(panel);
  },

  setCurrentMusic(id: string | number, index: number) {
    setTimeout(() => store.getInstance(id).togglePlay(false), 0);
    store.getInstance(id).setCurrentMusic(index);
    setTimeout(() => store.getInstance(id).togglePlay(true), 10);
  },
  setLyricOffset(id: string | number, offset: number) {
    store.getInstance(id).setLyricOffset(offset);
  },

  addMusicToList(id: string | number, item: Item) {
    store.getInstance(id).addMusicToList(item);
  },

  removeMusicFromList(id: string | number, index: number) {
    store.getInstance(id).removeMusicFromList(index);
  },
  changePlayerLayout(id: string | number, layout: string) {
    store.getInstance(id).changePlayerLayout(layout);
  },

  setPlayerLanguage(id: string | number, target: string) {
    store.getInstance(id).setPlayerLanguage(target);
  },
  /* MUSE Player API end */

  /* Middleware related */
  registerLayout(name: string, construct: (...args: any[]) => any) {
    this._layouts.push(name);
    construct();
  },
  registerMiddleware(hook: string, func: (...args: any[]) => any) {
    if (!this._middlewares[hook]) {
      return;
    }
    this._middlewares[hook].push(func);
  },
  destroyMiddleware(hook: string, func: (...args: any[]) => any) {
    const cmp = (ele: any) => ele === func;
    this._middlewares[hook].splice(this._middlewares[hook].find(cmp));
  },

  /* MUSE Player life cycle */
  destroy(id: string | number, par: any) {
    const parent = par === undefined
      ? document.getElementById(id as string).parentNode
      : par;
    let listLength = this.getState(id, 'playList').length;
    unmountComponentAtNode(parent);
    while (listLength--) {
      this.removeMusicFromList(id, 0);
    }
  },

  render(playList: Item[], node: Element, options: any) {
    if (options === undefined) {
      options = {};
    }

    if (!options.layout) {
      options.layout = 'muse-layout-default';
    }

    const playerID =
      'muse-player-' +
      Date.parse(new Date() as any) +
      '-' +
      Math.ceil(Math.random() * 233);

    const componentProps = {
      id: playerID,
      playList,
      ...options
    },
      Component = <PlayerContainer store={store} {...componentProps} />;

    interface MUSEPlayerInstance {
      component: React.ReactElement<any>;
      ref: Element;
      id: string | number;
    }

    const muse: MUSEPlayerInstance = {
      component: Component,
      ref: undefined,
      id: playerID
    };

    if (node !== undefined) {
      render(Component, node);
      muse.ref = document.getElementById(playerID);
    }

    return muse;
  },

  checkMUSEUpdate() {
    honoka.get('https://raw.githubusercontent.com/moefront/muse/master/package.json')
      .then(data => {
        data = JSON.parse(data);
        store.setLatestVersion(data.version);
        if (Number(parseFloat(data.version) - parseFloat(MuseDOM._version)) >= 0.1) {
          console.warn(
            'Tips: You are using an outdated version of MUSE.\n' +
            'The latest version of MUSE is ' + data.version + ', ' +
            'while you are using ' + MuseDOM._version + '.\n' +
            'Please consider upgrading your player: https://github.com/moefront/muse'
          );
        }
      });
  }
};

(window as any).MUSE = (window as any).YMPlayer = MuseDOM;

// layout register
MuseDOM.registerLayout('muse-layout-landscape', landscapeLayoutConstructor);

// check update
MuseDOM.checkMUSEUpdate();

export default MuseDOM;
export { PlayerContainer } from './containers';
