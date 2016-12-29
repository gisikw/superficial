import React from 'react';
import wrapRendered from './wrapRendered';

export default (component) => {
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
    wrapper.looks = wrapper.prototype.looks = component.looks;
    wrapper.propTypes = component.propTypes || {};
    wrapper.propTypes.width = React.PropTypes.number;
    return wrapper;
  }

  class Enhanced extends component {
    render() {
      const { __looksOverride, width } = this.props;
      this.looks = Object.assign({}, component.looks, __looksOverride);
      return wrapRendered(super.render(), width);
    }
  }
  if (!Enhanced.propTypes) Enhanced.propTypes = {};
  Enhanced.propTypes.width = React.PropTypes.number;
  Enhanced.prototype.looks = component.looks;
  Enhanced.displayName = component.displayName || component.name;
  return Enhanced;
};

function isStateless(component) {
  return !component.render &&
         !(component.prototype && component.prototype.render);
}
