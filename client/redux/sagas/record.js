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

function* getRecord({ id, callback }) {
  const record = yield fetch(`/api/record?id=${id}`);
  callback(record);
}

function* putRecord({ record, callback }) {
  yield fetch('/api/record', record, 'PUT');
  callback();
}

function* deleteRecord({ id, date, callback }) {
  yield fetch('/api/record', { id, date }, 'DELETE');
  callback();
}

// wacther saga
export default function* watchRecord() {
  yield takeEvery(types.GET_RECORDS, getRecords);
  yield takeEvery(types.POST_RECORD, postRecord);
  yield takeEvery(types.GET_RECORD, getRecord);
  yield takeEvery(types.PUT_RECORD, putRecord);
  yield takeEvery(types.DELETE_RECORD, deleteRecord);
}
