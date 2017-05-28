import { createStore , compose } from 'redux';
import { persistState } from 'redux-devtools';

import rootReducer from '../reducers';
import DevToolsContainer from '../containers/DevToolsContainer';

const enhancer = compose(
  DevToolsContainer.instrument(),
  persistState()
);


export const configureStore = (initialState) => {
  let store;
  if (process.env.NODE_ENV !== 'production') {
    store = createStore(rootReducer, initialState, enhancer);
  } else {
    store = createStore(rootReducer, initialState);
  }


  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
