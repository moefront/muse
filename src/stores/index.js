import { createStore } from 'redux';

import rootReducer from '../reducers';

export const configureStore = (initialState) => {
  let store;
  store = createStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
