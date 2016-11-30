import React from 'react';
import wrapRendered from './wrapRendered';

function Superficial(component) {
  if (isStateless(component)) {
    return props =>
      wrapRendered(component(props, component.looks), props.width);
  }

  class Enhanced extends component {
    render() { return wrapRendered(super.render(), this.props.width); }
  }
  Enhanced.propTypes = { width: React.PropTypes.number };
  Enhanced.prototype.looks = component.looks;
  return Enhanced;
}

function isStateless(component) {
  return !component.render &&
         !(component.prototype && component.prototype.render);
}

export default Superficial;
