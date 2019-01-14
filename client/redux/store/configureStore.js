import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';

import rootReducer from '../reducers/index';

export default function configureStore() {
  const store = createStore(
    combineReducers({
      rootReducer,
    }),
    compose(
      applyMiddleware(thunkMiddleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
    ),
  );
  return store;
}
