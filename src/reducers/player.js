import { PlayerActions } from '../actions';
import { applyMiddleware } from '../utils';

export const player = (state = {}, action) => {
  const id = action.id;
  switch (action.type) {
    case PlayerActions.CREATE_PLAYER_STORE:
      return {
        ...state,
        [id]: action.state
      };

    case PlayerActions.TOGGLE_PLAY:
      applyMiddleware(
        'onTogglePlay',
        state[id].playerInstance,
        action.playState
      );
      return {
        ...state,
        [id]: {
          ...state[id],
          isPlaying: action.playState
        }
      };

    case PlayerActions.TOGGLE_LOOP:
      return {
        ...state,
        [id]: {
          ...state[id],
          isLoop: action.loopState
        }
      };

    case PlayerActions.TOGGLE_FULLSCREEN:
      applyMiddleware(
        'onToggleFullscreen',
        state[id].playerInstance,
        action.fullscreenState
      );
      return {
        ...state,
        [id]: {
          ...state[id],
          isFullscreen: action.fullscreenState
        }
      };

    case PlayerActions.TOGGLE_MENU:
      applyMiddleware(
        'onToggleMenu',
        state[id].playerInstance,
        action.menuState
      );
      return {
        ...state,
        [id]: {
          ...state[id],
          isMenuOpen: action.menuState
        }
      };

    case PlayerActions.TOGGLE_DRAWER:
      applyMiddleware(
        'onToggleDrawer',
        state[id].playerInstance,
        action.drawerState
      );
      return {
        ...state,
        [id]: {
          ...state[id],
          isDrawerOpen: action.drawerState,
          currentPanel: action.drawerState ? state.currentPanel : 'lyric'
        }
      };

    case PlayerActions.TOGGLE_PANEL:
      return {
        ...state,
        [id]: {
          ...state[id],
          currentPanel: action.panel
        }
      };

    case PlayerActions.PLAYER_STOP:
      return {
        ...state,
        [id]: {
          ...state[id],
          isPlaying: false,
          currentTime: 0
        }
      };

    case PlayerActions.SLIDE_VOLUME:
      return {
        ...state,
        [id]: {
          ...state[id],
          volume: action.volume
        }
      };

    case PlayerActions.SLIDE_PROPGRESS:
      return {
        ...state,
        [id]: {
          ...state[id],
          currentTime: action.progress
        }
      };

    case PlayerActions.SET_CURRENT_MUSIC:
      applyMiddleware(
        'onMusicChange',
        state[id].playerInstance,
        state[id].playList[action.index]
      );
      return {
        ...state,
        [id]: {
          ...state[id],
          currentMusicIndex: action.index
        }
      };

    case PlayerActions.SET_LYRIC_OFFSET:
      return {
        ...state,
        [id]: {
          ...state[id],
          offset: action.offset
        }
      };

    case PlayerActions.SET_CURRENT_LYRIC:
      return {
        ...state,
        [id]: {
          ...state[id],
          index: action.index
        }
      };

    case PlayerActions.ADD_MUSIC_TO_LIST:
      return {
        ...state,
        [id]: {
          ...state[id],
          playList: [...state[id].playList, action.item]
        }
      };

    case PlayerActions.REMOVE_MUSIC_FROM_LIST:
      return {
        ...state,
        [id]: {
          ...state[id],
          playList: [
            state[id].playList.slice(0, action.index - 1),
            state[id].playList.slice(
              action.index + 1,
              state[id].playList.length
            )
          ]
        }
      };

    case PlayerActions.CHANGE_PLAYER_LAYOUT:
      return {
        ...state,
        [id]: {
          ...state[id],
          playerLayout: action.layout
        }
      };

    case PlayerActions.PUSH_PLAYER_INSTANCE:
      return {
        ...state,
        [id]: {
          ...state[id],
          playerInstance: action.instance
        }
      };

    default:
      return state;
  }
};