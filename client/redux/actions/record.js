import 'babel-polyfill';
import 'whatwg-fetch';

import * as types from '../constants/index';
import fetch from '../../utils/fetch';

function getRecordsSuccess(maxid) {
  return {
    type: types.GET_RECORDS_SUCCESS,
    maxid,
  };
}

function postRecordSuccess(maxid) {
  return {
    type: types.POST_RECORD_SUCCESS,
    maxid,
  };
}

// 获取记录列表
export function getRecords(keywords, callback) {
  return dispatch => fetch(`/api/records?keywords=${keywords}`)
    .then((records) => {
      const maxid = records.map(record => record.id).sort((a, b) => b - a)[0];
      callback(records);
      dispatch(getRecordsSuccess(maxid));
    });
}

export function getRecord(id, callback) {
  return () => fetch(`/api/record?id=${id}`)
    .then((record) => {
      console.log('record', record);
      callback(record);
    });
}

export function postRecord(record, callback) {
  return dispatch => fetch('/api/record', record, 'POST')
    .then(() => {
      dispatch(postRecordSuccess(record.id));
      callback();
    });
}

export function putRecord(record, callback) {
  return () => fetch('/api/record', record, 'PUT')
    .then(() => {
      callback();
    });
}

export function deleteRecord(id, date, callback) {
  return () => fetch('/api/record', { id, date }, 'DELETE')
    .then(() => {
      callback();
    });
}
