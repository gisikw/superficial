import PropTypes from 'prop-types';
import wrapRendered from './wrapRendered';
import preprocess from './preprocessor';

function wrapComponent(component) {
  return isStateless(component)
    ? wrapStatelessComponent(component)
    : wrapStatefulComponent(component);
}

function wrapStatelessComponent(component) {
  component.looks = preprocess(component.looks || {});
  const wrapper = props =>
    wrapRendered(component(props), props.width);
  wrapper.displayName = component.displayName || component.name;
  wrapper.looks = component.looks;
  wrapper.prototype.looks = component.looks;
  wrapper.propTypes = component.propTypes || {};
  if (!wrapper.propTypes.width) wrapper.propTypes.width = PropTypes.number;
  return wrapper;
}

function wrapStatefulComponent(component) {
  component.looks = preprocess(component.looks || {});
  class Enhanced extends component {
    constructor(...args) {
      super(...args);
      this.looks = component.looks;
    }
    render() { return wrapRendered(super.render(), this.props.width); }
  }
  if (!Enhanced.propTypes) Enhanced.propTypes = {};
  if (!Enhanced.propTypes.width) Enhanced.propTypes.width = PropTypes.number;
  Enhanced.prototype.looks = component.looks;
  Enhanced.displayName = component.displayName || component.name;
  return Enhanced;
}

function isStateless(component) {
  return !component.render &&
         !(component.prototype && component.prototype.render);
}

export default wrapComponent;
