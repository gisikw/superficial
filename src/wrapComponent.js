import PropTypes from 'prop-types';
import wrapRendered from './wrapRendered';

export default (component) => {
  if (isStateless(component)) {
    if (!component.looks) component.looks = {};
    const wrapper = props =>
      wrapRendered(component(props), props.width);
    wrapper.displayName = component.displayName || component.name;
    wrapper.looks = wrapper.prototype.looks = component.looks;
    wrapper.propTypes = component.propTypes || {};
    if (!wrapper.propTypes.width) {
      wrapper.propTypes.width = PropTypes.number;
    }
    return wrapper;
  }

  class Enhanced extends component {
    render() {
      const { width } = this.props;
      this.looks = component.looks || {};
      return wrapRendered(super.render(), width);
    }
  }
  if (!Enhanced.propTypes) Enhanced.propTypes = {};
  if (!Enhanced.propTypes.width) {
    Enhanced.propTypes.width = PropTypes.number;
  }
  Enhanced.prototype.looks = component.looks;
  Enhanced.displayName = component.displayName || component.name;
  return Enhanced;
};

function isStateless(component) {
  return !component.render &&
         !(component.prototype && component.prototype.render);
}
