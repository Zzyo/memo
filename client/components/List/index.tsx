import * as React from 'react';
import * as PropTypes from 'prop-types';

import { inject, observer } from 'mobx-react';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import './index.scss';
import RecordStore from '../../stores/RecordStore';

interface Props {
  recordStore: RecordStore;
}

@inject('recordStore')
@observer
export default class List extends React.Component<Props, {}> {

  public static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props: any, context: any) {
    super(props, context);
    this.goToRecord = this.goToRecord.bind(this);
  }

  public componentWillMount() {
    const { recordStore } = this.props;
    recordStore.fetchRecords();
  }

  public componentDidMount() {
    const { recordStore } = this.props;
    const searchInput = document.querySelector('#searchInput');
    Observable.fromEvent(searchInput, 'input')
      .debounceTime(200)
      .map((event: any) => event.target.value)
      .subscribe((value) => recordStore.fetchRecords(value));
  }

  public goToRecord(record: MemoRecord = null) {
    const { recordStore } = this.props;
    const fn = () => {
      this.context.router.history.push('/record');
    };
    if (record) { // 编辑
      recordStore.setRecord(record, fn);
    } else { // 新增
      recordStore.resetRecord();
      fn();
    }
  }

  public render() {
    const { recordStore } = this.props;
    const colorMap = new Map();
    colorMap.set('tour', 'yellow');
    colorMap.set('personal', 'blue');
    colorMap.set('life', 'green');
    colorMap.set('work', 'red');
    const recordBlock = recordStore.records.map((item: MemoRecord) => {
      return (
        <div className="record" key={item.id} onClick={() => this.goToRecord(item)}>
          {item.tag === '' ? null : <i className={`iconfont icon-tag icon--${colorMap.get(item.tag)}`}/>}
          <div className="record__content">{item.content}</div>
          <div className="record__date">{item.date}</div>
        </div>
      );
    });
    return (
      <div className="List">
        <div className="search">
          <input id="searchInput" className="search__input" placeholder="搜索"/>
        </div>
        <div className="records">
          {recordBlock}
        </div>
        <div className="create" onClick={() => this.goToRecord()}>
          <div className="create__icon">
            <i className="iconfont icon-add"/>
          </div>
          <div className="create__text">新建</div>
        </div>
      </div>
    );
  }
}
