import { Observable } from 'rxjs/Observable';
import * as types from '../constants/index';
import * as actions from '../actions/record';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';

import fetch from '../../utils/fetch';

export const getRecordsEpics = action$ => action$.ofType(types.GET_RECORDS)
  .mergeMap(action => Observable.fromPromise(fetch(`/api/records?keywords=${action.keywords}`))
    .map((records) => {
      action.callback(records);
      return actions.getRecordsSuccess(
        records.map(record => record.id).sort((a, b) => b - a)[0],
      );
    }));

export const postRecordEpics = action$ => action$.ofType(types.POST_RECORD)
  .mergeMap(action => Observable.fromPromise(fetch('/api/record', action.record, 'POST'))
    .map(() => {
      action.callback();
      return actions.postRecordSuccess(action.id);
    }));
