import { combineReducers } from 'redux';

import record from './record';

// 合并reducer
const rootReducer = combineReducers({
  record,
});

export default rootReducer;
