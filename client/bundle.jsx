import * as React from 'react';

export default class Bundle extends React.Component {
  state = {
    mod: null,
  }

  componentWillMount() {
    this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { load } = this.props;
    if (nextProps.load !== load) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({
      mod: null,
    });
    props.load((mod) => {
      this.setState({
        mod: mod.default ? mod.default : mod,
      });
    });
  }

  render() {
    const { mod } = this.state;
    const { children } = this.props;
    if (!mod) return false;
    return children(mod);
  }
}
