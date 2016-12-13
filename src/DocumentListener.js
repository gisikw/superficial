import React from 'react';

export default class DocumentListener extends React.Component {
  constructor(...args) {
    super(...args);
    this.update = this.update.bind(this);
    this.state = { width: global.document.documentElement.clientWidth };
  }

  componentDidMount() {
    global.addEventListener('resize', this.update);
  }

  componentWillUnmount() {
    global.removeEventListener('resize', this.update);
  }

  update() {
    this.setState({ width: global.document.documentElement.clientWidth });
  }

  render() {
    return (
      <div>
        {
          React.Children.map(
            this.props.children,
            child => React.cloneElement(child, this.state),
          )
        }
      </div>
    );
  }
}

DocumentListener.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};
