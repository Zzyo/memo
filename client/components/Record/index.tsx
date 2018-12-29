import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import './index.scss';
import RecordStore from '../../stores/RecordStore';

enum Tag { Unset, Tour, Personal, Life, Work }

enum Status { Init, Pending, Done }

interface State {
  status: Status;
  target: Tag;
  date: string;
  content: string;
  modalshow: boolean;
}

interface Props {
  recordStore: RecordStore;
}

@inject('recordStore')
@observer
export default class Record extends React.Component<Props, State> {

  public state: State; // state不再是readonly

  constructor(props: any) {
    super(props);
    this.changeContent = this.changeContent.bind(this);
    this.showmodal = this.showmodal.bind(this);
    this.changeTarget = this.changeTarget.bind(this);
    this.hidemodal = this.hidemodal.bind(this);
    this.saveRecord = this.saveRecord.bind(this);
    this.state = {
      status: Status.Init,
      target: Tag.Unset,
      date: '',
      content: '',
      modalshow: false,
    };
  }

  public componentWillMount() {
    const { recordStore } = this.props;
    if (recordStore.editid === 0) {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth() + 1;
      const d = date.getDate();
      this.setState({
        date: `${y}-${m}-${d}`,
      });
    } else {
      const tag = recordStore.edittag;
      let target;
      if (tag === '') {
        target = Tag.Unset;
      } else if (tag === 'tour') {
        target = Tag.Tour;
      } else if (tag === 'personal') {
        target = Tag.Personal;
      } else if (tag === 'life') {
        target = Tag.Life;
      } else if (tag === 'work') {
        target = Tag.Work;
      }
      this.setState({
        target,
        date: recordStore.editdate,
        content: recordStore.editcontent,
      });
    }
  }

  public changeContent(event) {
    this.setState({
      content: event.target.value,
    });
  }

  public showmodal() {
    this.setState({
      modalshow: true,
    });
  }

  public changeTarget(tar: Tag) {
    const { target } = this.state;
    if (target !== tar) {
      this.setState({
        target: tar,
        modalshow: false,
      });
    }
  }

  public hidemodal() {
    this.setState({
      modalshow: false,
    });
  }

  public saveRecord() { // 保存记录，根据editid是否为0判断是新增还是编辑
    const { target, date, content } = this.state;
    const { recordStore } = this.props;
    const id = recordStore.editid === 0 ? recordStore.maxid + 1 : recordStore.editid;
    let tag;
    if (target === Tag.Unset) {
      tag = '';
    } else if (target === Tag.Tour) {
      tag = 'tour';
    } else if (target === Tag.Personal) {
      tag = 'personal';
    } else if (target === Tag.Life) {
      tag = 'life';
    } else if (target === Tag.Work) {
      tag = 'work';
    }
    const callback = () => {
      this.setState({
        status: Status.Done,
      });
    };
    this.setState({
      status: Status.Pending,
    }, () => {
      if (recordStore.editid === 0) {
        recordStore.postRecord({ id, date, content, tag }, callback);
      } else {
        recordStore.putRecord({ id, date, content, tag }, callback);
      }
    });
  }

  public render() {
    const { status, target, date, content, modalshow } = this.state;
    if (status === Status.Done) {
      return <Redirect to="/"/>;
    }
    const header = () => {
      if (target === Tag.Unset) {
        return <span>添加标签</span>;
      } else if (target === Tag.Tour) {
        return <span><i className="iconfont icon-tag icon--yellow"/>旅游</span>;
      } else if (target === Tag.Personal) {
        return <span><i className="iconfont icon-tag icon--blue"/>个人</span>;
      } else if (target === Tag.Life) {
        return <span><i className="iconfont icon-tag icon--green"/>生活</span>;
      } else if (target === Tag.Work) {
        return <span><i className="iconfont icon-tag icon--red"/>工作</span>;
      }
    };
    return (
      <div className="Record">
        <div className="header">
          <div className="header__target" onClick={this.showmodal}>
            {header()}
          </div>
          <div className="header__date">{date}</div>
        </div>
        <div className="content">
          <textarea className="content__textarea" value={content} onChange={this.changeContent}/>
        </div>
        <div className="btn--top" onClick={this.saveRecord}>保存</div>
        <div className="modal" style={{display: modalshow ? '' : 'none'}}>
          <div className="modal__mask" onClick={this.hidemodal}/>
          <div className="modal__wrapper">
            <div className="modal__header">添加标签</div>
            <div className="modal__tags">
              <div className="tag">
                <i className="iconfont icon-tag icon--yellow"/>
                <div className="tag__content">
                  <div className="tag__title">
                    <span>旅游</span>
                  </div>
                  <div className={target === Tag.Tour ? 'tag__radio--selected' : 'tag__radio'} onClick={() => this.changeTarget(Tag.Tour)}/>
                </div>
              </div>
              <div className="tag">
                <i className="iconfont icon-tag icon--blue"/>
                <div className="tag__content">
                  <div className="tag__title">
                    <span>个人</span>
                  </div>
                  <div className={target === Tag.Personal ? 'tag__radio--selected' : 'tag__radio'} onClick={() => this.changeTarget(Tag.Personal)}/>
                </div>
              </div>
              <div className="tag">
                <i className="iconfont icon-tag icon--green"/>
                <div className="tag__content">
                  <div className="tag__title">
                    <span>生活</span>
                  </div>
                  <div className={target === Tag.Life ? 'tag__radio--selected' : 'tag__radio'} onClick={() => this.changeTarget(Tag.Life)}/>
                </div>
              </div>
              <div className="tag">
                <i className="iconfont icon-tag icon--red"/>
                <div className="tag__content">
                  <div className="tag__title">
                    <span>工作</span>
                  </div>
                  <div className={target === Tag.Work ? 'tag__radio--selected' : 'tag__radio'} onClick={() => this.changeTarget(Tag.Work)}/>
                </div>
              </div>
              <div className="tag">
                <i className="iconfont icon-tag icon--gray"/>
                <div className="tag__content">
                  <div className="tag__title">
                    <span>不设定标签</span>
                  </div>
                  <div className={target === Tag.Unset ? 'tag__radio--selected' : 'tag__radio'} onClick={() => this.changeTarget(Tag.Unset)}/>
                </div>
              </div>
            </div>
            <div className="modal__btn--modal" onClick={this.hidemodal}>取消</div>
          </div>
        </div>
      </div>
    );
  }
}
