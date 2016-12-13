import React from 'react';
import wrapRendered from './wrapRendered';
import interpolate from './interpolate';
import DocumentListener from './DocumentListener';

function Superficial(component) {
  if (isStateless(component)) {
    const wrapper = props =>
      wrapRendered(
        component(
          props,
          Object.assign({}, component.looks, props.__looksOverride),
        ),
        props.width,
      );
    wrapper.displayName = component.displayName || component.name;
    return wrapper;
  }

  class Enhanced extends component {
    render() {
      const { __looksOverride, width } = this.props;
      this.looks = Object.assign({}, component.looks, __looksOverride);
      return wrapRendered(super.render(), width);
    }
  }
  Enhanced.propTypes = { width: React.PropTypes.number };
  Enhanced.prototype.looks = component.looks;
  Enhanced.displayName = component.displayName || component.name;
  return Enhanced;
}

function isStateless(component) {
  return !component.render &&
         !(component.prototype && component.prototype.render);
}

export default Superficial;
export { interpolate, DocumentListener };
