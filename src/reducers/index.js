import { combineReducers } from 'redux';
// raw reducers
import { player } from './player';

const rootReducer = combineReducers({
  player
});

export default rootReducer;
