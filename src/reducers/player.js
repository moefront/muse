import { PlayerActions } from '../actions';
import { applyMiddleware } from '../utils';

export const player = (
  state = {
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
    playerLayout: 'default',
    playerInstance: undefined
  },
  action
) => {
  switch (action.type) {
    case PlayerActions.TOGGLE_PLAY:
      applyMiddleware('onTogglePlay', state.playerInstance, action.playState);
      return {
        ...state,
        isPlaying: action.playState
      };

    case PlayerActions.TOGGLE_LOOP:
      return {
        ...state,
        isLoop: action.loopState
      };

    case PlayerActions.TOGGLE_FULLSCREEN:
      applyMiddleware(
        'onToggleFullscreen',
        state.playerInstance,
        action.fullscreenState
      );
      return {
        ...state,
        isFullscreen: action.fullscreenState
      };

    case PlayerActions.TOGGLE_MENU:
      applyMiddleware('onToggleMenu', state.playerInstance, action.menuState);
      return {
        ...state,
        isMenuOpen: action.menuState
      };

    case PlayerActions.TOGGLE_DRAWER:
      applyMiddleware(
        'onToggleDrawer',
        state.playerInstance,
        action.drawerState
      );
      return {
        ...state,
        isDrawerOpen: action.drawerState,
        currentPanel: action.drawerState ? state.currentPanel : 'lyric'
      };

    case PlayerActions.TOGGLE_PANEL:
      return {
        ...state,
        currentPanel: action.panel
      };

    case PlayerActions.PLAYER_STOP:
      return {
        ...state,
        isPlaying: false,
        currentTime: 0
      };

    case PlayerActions.SLIDE_VOLUME:
      return {
        ...state,
        volume: action.volume
      };

    case PlayerActions.SLIDE_PROPGRESS:
      return {
        ...state,
        currentTime: action.progress
      };

    case PlayerActions.SET_CURRENT_MUSIC:
      applyMiddleware(
        'onMusicChange',
        state.playerInstance,
        state.playList[action.index]
      );
      return Object.assign({}, state, {
        currentMusicIndex: action.index
      });

    case PlayerActions.SET_LYRIC_OFFSET:
      return {
        ...state,
        offset: action.offset
      };

    case PlayerActions.SET_CURRENT_LYRIC:
      return {
        ...state,
        index: action.index
      };

    case PlayerActions.ADD_MUSIC_TO_LIST:
      return {
        ...state,
        playList: [...state.playList, action.item]
      };

    case PlayerActions.REMOVE_MUSIC_FROM_LIST:
      return {
        ...state,
        playList: [
          state.playList.slice(0, action.index - 1),
          state.playList.slice(action.index + 1, state.playList.length)
        ]
      };

    case PlayerActions.CHANGE_PLAYER_LAYOUT:
      return {
        ...state,
        playerLayout: action.layout
      };

    case PlayerActions.PUSH_PLAYER_INSTANCE:
      return {
        ...state,
        playerInstance: action.instance
      };

    default:
      return state;
  }
};