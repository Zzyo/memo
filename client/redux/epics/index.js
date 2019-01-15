import { combineEpics } from 'redux-observable';

import { getRecordsEpics, postRecordEpics } from './record';

export default combineEpics(
  getRecordsEpics,
  postRecordEpics,
);
