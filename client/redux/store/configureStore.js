import { createStore, applyMiddleware, combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import rootReducer from '../reducers/index';
import rootEpics from '../epics/index';

const epicMiddleware = createEpicMiddleware(rootEpics);

export default function configureStore() {
  const store = createStore(
    combineReducers({
      rootReducer,
    }),
    applyMiddleware(epicMiddleware),
  );
  return store;
}
