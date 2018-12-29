import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';

// 倒入字体图标
import './iconfont/iconfont.css';

// bundle模型用来异步加载组件
import Record from 'bundle-loader?lazy&name=record!./components/Record/index.tsx';
import Bundle from './bundle';

// 同步引入
import List from './components/List/index.tsx';

// 加载store
import RecordStore from './stores/RecordStore';

const store = {
  recordStore: new RecordStore(),
};

// 生产懒加载方法
const generateLazyComponent = el => () => (
  <Bundle load={el}>
    {Component => <Component />}
  </Bundle>
);

ReactDOM.render(
  <Provider {...store}>
    <BrowserRouter basename="/">
      <div>
        <Route exact path="/" component={List} />
        <Route path="/record" component={generateLazyComponent(Record)} />
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app'),
);
