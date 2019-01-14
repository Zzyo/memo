import * as types from '../constants/index';

export default function record(state = { maxid: 0 }, action = {}) {
  switch (action.type) {
    case types.GET_RECORDS_SUCCESS:
      return Object.assign({}, state, {
        maxid: action.maxid,
      });
    case types.POST_RECORD_SUCCESS:
      return Object.assign({}, state, {
        maxid: action.maxid,
      });
    default:
      return state;
  }
}
