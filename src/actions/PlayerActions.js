export const TOGGLE_PLAY             = 'TOGGLE_PLAY';
export const TOGGLE_LOOP             = 'TOGGLE_LOOP';
export const TOGGLE_DRAWER           = 'TOGGLE_DRAWER';
export const TOGGLE_MENU             = 'TOGGLE_MENU';
export const TOGGLE_FULLSCREEN       = 'TOGGLE_FULLSCREEN';
export const TOGGLE_PANEL            = 'TOGGLE_PANEL';
export const PLAYER_STOP             = 'PLAYER_STOP';
export const SLIDE_VOLUME            = 'SLIDE_VOLUME';
export const SLIDE_PROPGRESS         = 'SLIDE_PROPGRESS';
export const SET_CURRENT_MUSIC       = 'SET_CURRENT_MUSIC';
export const SET_LYRIC_OFFSET        = 'SET_LYRIC_OFFSET';
export const SET_CURRENT_LYRIC       = 'SET_CURRENT_LYRIC';
export const ADD_MUSIC_TO_LIST       = 'ADD_MUSIC_TO_LIST';
export const REMOVE_MUSIC_FROM_LIST  = 'REMOVE_MUSIC_FROM_LIST';
export const CHANGE_PLAYER_LAYOUT    = 'CHANGE_PLAYER_LAYOUT';
export const PUSH_PLAYER_INSTANCE    = 'PUSH_PLAYER_INSTANCE';
export const CREATE_PLAYER_STORE     = 'CREATE_PLAYER_STORE';

export const togglePlay = (playState, id) => {
  return {
    type: TOGGLE_PLAY,
    id,
    playState
  };
};

export const toggleLoop = (loopState, id) => {
  return {
    type: TOGGLE_LOOP,
    id,
    loopState
  };
};

export const toggleMenu = (menuState, id) => {
  return {
    type: TOGGLE_MENU,
    id,
    menuState
  };
};

export const toggleDrawer = (drawerState, id) => {
  return {
    type: TOGGLE_DRAWER,
    id,
    drawerState
  };
};

export const toggleFullscreen = (fullscreenState, id) => {
  return {
    type: TOGGLE_FULLSCREEN,
    id,
    fullscreenState
  }
};

export const togglePanel = (panel, id) => {
  return {
    type: TOGGLE_PANEL,
    id,
    panel
  }
};

export const playerStop = (id) => {
  return {
    type: PLAYER_STOP,
    id
  };
};

export const slideVolume = (volume, id) => {
  return {
    type: SLIDE_VOLUME,
    id,
    volume
  };
};

export const slideProgress = (progress, id) => {
  return {
    type: SLIDE_PROPGRESS,
    id,
    progress
  };
};

export const setCurrentMusic = (index, id) => {
  return {
    type: SET_CURRENT_MUSIC,
    id,
    index
  };
};

export const setLyricOffset = (offset, id) => {
  return {
    type: SET_LYRIC_OFFSET,
    id,
    offset
  };
};

export const setCurrentLyric = (index, id) => {
  return {
    type: SET_CURRENT_LYRIC,
    id,
    index
  };
};

export const addMusicToList = (item = {
  title: undefined,
  artist: undefined,
  cover: undefined,
  src: undefined,
  lyric: undefined,
  translation: undefined
}, id) => {
  return {
    type: ADD_MUSIC_TO_LIST,
    id,
    item
  };
};

export const removeMusicFromList = (index, id) => {
  return {
    type: REMOVE_MUSIC_FROM_LIST,
    id,
    index
  };
};

export const changePlayerLayout = (layout, id) => {
  return {
    type: CHANGE_PLAYER_LAYOUT,
    id,
    layout
  };
};

export const pushPlayerInstance = (instance, id) => {
  return {
    type: PUSH_PLAYER_INSTANCE,
    id,
    instance
  };
};

export const createPlayerStore = (state, id) => {
  let defaultState = {
    isPlaying: false,
    isLoop: false,
    isDrawerOpen: false,
    isMenuOpen: false,
    isFullscreen: false,

    volume: 1,
    offset: 0,
    currentTime: undefined,
    currentPanel: 'lyric',
    duration: undefined,

    currentMusicIndex: 0,
    currentLyricIndex: -1,
    playList: [],
    playerLayout: 'muse-layout-default',
    playerInstance: undefined
  };

  return {
    type: CREATE_PLAYER_STORE,
    id,
    state: {
      ...defaultState,
      ...state
    }
  }
};
