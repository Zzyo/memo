import { combineEpics } from 'redux-observable';

import { getRecordsEpics, postRecordEpics, getRecordEpics, putRecordEpics, deleteRecordEpics } from './record';

export default combineEpics(
  getRecordsEpics,
  postRecordEpics,
  getRecordEpics,
  putRecordEpics,
  deleteRecordEpics,
);
