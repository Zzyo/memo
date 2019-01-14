import * as React from 'react';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

import './index.scss';
import * as action from '../../redux/actions/record';

interface Props {
  maxid: number;
  dispatch: any;
}

interface State {
  records: MemoRecord[];
}

class List extends React.Component<Props, State> {

  public static contextTypes = {
    router: PropTypes.object,
  };

  public state: State; // state不再是readonly

  constructor(props: any, context: any) {
    super(props, context);
    this.goToRecord = this.goToRecord.bind(this);
    this.state = {
      records: [],
    };
  }

  public componentWillMount() {
    const { dispatch } = this.props;
    dispatch(action.getRecords('', (records) => {
      this.setState({ records });
    }));
  }

  public componentDidMount() {
    const { dispatch } = this.props;
    const searchInput = document.querySelector('#searchInput');
    Observable.fromEvent(searchInput, 'input')
      .debounceTime(200)
      .map((event: any) => event.target.value)
      .subscribe((value) => dispatch(action.getRecords(value, (records) => {
        this.setState({ records });
      })));
  }

  public goToRecord(record: MemoRecord = null) {
    if (record) { // 编辑
      this.context.router.history.push(`/record?id=${record.id}`);
    } else { // 新增
      this.context.router.history.push(`/record`);
    }
  }

  public render() {
    const { records } = this.state;
    const colorMap = new Map();
    colorMap.set('tour', 'yellow');
    colorMap.set('personal', 'blue');
    colorMap.set('life', 'green');
    colorMap.set('work', 'red');
    const recordBlock = records.map((item: MemoRecord) => {
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

function mapStateToProps(state) {
  return {
    maxid: state.rootReducer.record.maxid,
  };
}

export default connect(mapStateToProps)(List);
