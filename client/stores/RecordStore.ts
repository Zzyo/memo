import { action, computed, observable, runInAction } from 'mobx';

import fetch from '../utils/fetch';

export default class RecordStore {

  @observable public maxid: number = 0; // 当前记录最大的id，用来计算新增的记录id

  @observable public records: MemoRecord[] = []; // 记录数据

  @action.bound
  public async fetchRecords(keywords: string = '') {
    const records = await fetch(`/api/records?keywords=${keywords}`);
    runInAction(() => {
      this.records = records;
      this.maxid = records.map((r) => r.id).sort((a, b) => b - a)[0];
    });
  }

  @action
  public async getRecord(id: string, callback: any) {
    const record = await fetch(`/api/record?id=${id}`);
    callback(record);
  }

  @action.bound
  public async postRecord(record: MemoRecord, callback: any) {
    await fetch('/api/record', record, 'POST');
    this.updateMaxid(record.id);
    callback();
  }

  @action.bound
  public async putRecord(record: MemoRecord, callback: any) {
    await fetch('/api/record', record, 'PUT');
    callback();
  }

  @action.bound
  public async deleteRecord(id: number, date: string, callback: any) {
    await fetch('/api/record', { id, date }, 'DELETE');
    callback();
  }

  @action.bound
  public updateMaxid(maxid: number) {
    this.maxid = maxid;
  }

}
