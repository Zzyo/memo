import { takeEvery, put } from 'redux-saga/effects';

import * as types from '../constants/index';
import * as actions from '../actions/record';
import fetch from '../../utils/fetch';

// worker saga

function* getRecords({ keywords, callback }) {
  const records = yield fetch(`/api/records?keywords=${keywords}`);
  const maxid = records.map(record => record.id).sort((a, b) => b - a)[0];
  callback(records);
  yield put(actions.getRecordsSuccess(maxid));
}

function* postRecord({ record, callback }) {
  yield fetch('/api/record', record, 'POST');
  callback();
  yield put(actions.postRecordSuccess(record.id));
}

// wacther saga
export default function* watchRecord() {
  yield takeEvery(types.GET_RECORDS, getRecords);
  yield takeEvery(types.POST_RECORD, postRecord);
}
