import React from 'react';
import PropTypes from 'prop-types';

export default class DocumentListener extends React.Component {
  constructor(...args) {
    super(...args);
    this.update = this.update.bind(this);
    this.state = clientDimensions();
  }

  componentDidMount() {
    global.addEventListener('resize', this.update);
  }

  componentWillUnmount() {
    global.removeEventListener('resize', this.update);
  }

  update() {
    this.setState(clientDimensions());
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

function clientDimensions() {
  return {
    width: global.document.documentElement.clientWidth,
    height: global.document.documentElement.clientHeight,
  };
}

DocumentListener.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
