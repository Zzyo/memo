import { action, observable, runInAction } from 'mobx';

import fetch from '../utils/fetch';

export default class RecordStore {

  @observable public editid: number = 0; // 当前正在编辑的记录id，如果为新增记录，则值为0

  @observable public editdate: string = ''; // 当前正在编辑的记录的日期

  @observable public editcontent: string = ''; // 当前正在编辑的记录的内容

  @observable public edittag: string = ''; // 当前正在编辑的记录的标签

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

  @action.bound
  public async postRecord(record: MemoRecord, callback: any) {
    await fetch('/api/record', record, 'POST');
    this.updateMaxid(record.id);
    this.resetRecord();
    callback();
  }

  @action.bound
  public async putRecord(record: MemoRecord, callback: any) {
    await fetch('/api/record', record, 'PUT');
    this.resetRecord();
    callback();
  }

  @action.bound
  public updateMaxid(maxid: number) {
    this.maxid = maxid;
  }

  @action.bound
  public setRecord(record: MemoRecord, callback: any) {
    this.editid = record.id;
    this.editdate = record.date;
    this.editcontent = record.content;
    this.edittag = record.tag;
    callback();
  }

  @action.bound
  public resetRecord() {
    this.editid = 0;
    this.editdate = '';
    this.editcontent = '';
    this.edittag = '';
  }
}
