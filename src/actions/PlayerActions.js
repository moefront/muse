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

export const togglePlay = (playState) => {
  return {
    type: TOGGLE_PLAY,
    playState
  };
};

export const toggleLoop = (loopState) => {
  return {
    type: TOGGLE_LOOP,
    loopState
  };
};

export const toggleMenu = (menuState) => {
  return {
    type: TOGGLE_MENU,
    menuState
  };
};

export const toggleDrawer = (drawerState) => {
  return {
    type: TOGGLE_DRAWER,
    drawerState
  };
};

export const toggleFullscreen = (fullscreenState) => {
  return {
    type: TOGGLE_FULLSCREEN,
    fullscreenState
  }
};

export const togglePanel = (panel) => {
  return {
    type: TOGGLE_PANEL,
    panel
  }
};

export const playerStop = () => {
  return {
    type: PLAYER_STOP
  };
};

export const slideVolume = (volume) => {
  return {
    type: SLIDE_VOLUME,
    volume
  };
};

export const slideProgress = (progress) => {
  return {
    type: SLIDE_PROPGRESS,
    progress
  };
};

export const setCurrentMusic = (index) => {
  return {
    type: SET_CURRENT_MUSIC,
    index
  };
};

export const setLyricOffset = (offset) => {
  return {
    type: SET_LYRIC_OFFSET,
    offset
  };
};

export const setCurrentLyric = (index) => {
  return {
    type: SET_CURRENT_LYRIC,
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
}) => {
  return {
    type: ADD_MUSIC_TO_LIST,
    item
  };
};

export const removeMusicFromList = (index) => {
  return {
    type: REMOVE_MUSIC_FROM_LIST,
    index
  };
};

export const changePlayerLayout = (layout) => {
  return {
    type: CHANGE_PLAYER_LAYOUT,
    layout
  };
};

export const pushPlayerInstance = (instance) => {
  return {
    type: PUSH_PLAYER_INSTANCE,
    instance
  };
};
