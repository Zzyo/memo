import * as types from '../constants/index';

export function getRecords(keywords = '', callback) {
  return {
    type: types.GET_RECORDS,
    keywords,
    callback,
  };
}

export function getRecordsSuccess(maxid) {
  return {
    type: types.GET_RECORDS_SUCCESS,
    maxid,
  };
}

export function postRecord(record, callback) {
  return {
    type: types.POST_RECORD,
    record,
    callback,
  };
}

export function postRecordSuccess(maxid) {
  return {
    type: types.POST_RECORD_SUCCESS,
    maxid,
  };
}

export function getRecord(id, callback) {
  return {
    type: types.GET_RECORD,
    id,
    callback,
  };
}

export function putRecord(record, callback) {
  return {
    type: types.PUT_RECORD,
    record,
    callback,
  };
}

export function deleteRecord(id, date, callback) {
  return {
    type: types.DELETE_RECORD,
    id,
    date,
    callback,
  };
}

export function def() {
  return {
    type: 'default',
  };
}
