import React from 'react';
import interpolate from './interpolate';

function Superficial(Component) {
  if (!Component.render &&
      !(Component.prototype && Component.prototype.render)) {
    return props =>
      lookify(Component(props, Component.looks), props.width);
  }

  class Enhanced extends Component {
    render() { return lookify(super.render(), this.props.width); }
  }
  Enhanced.propTypes = { width: React.PropTypes.number };
  Enhanced.prototype.looks = Component.looks;
  return Enhanced;
}

function lookify(component, width) {
  if (!component || !component.props ||
      (!component.props.looks && !component.props.children)) return component;
  const style = interpolate(Object.assign({},
    Array.isArray(component.props.looks)
      ? component.props.looks.reduce((look, h) =>
          Object.assign({}, h, look), {})
      : component.props.looks,
    component.props.style,
  ));
  const newProps = { style };
  if (typeof style === 'function') newProps.style = style(width);
  Object.keys(component.props).forEach((k) => {
    if (k !== 'looks' && k !== 'style' && k !== 'children') {
      newProps[k] = component.props[k];
    }
  });
  if (Array.isArray(component.props.children)) {
    newProps.children = component.props.children.map(c => lookify(c, width));
  } else newProps.children = lookify(component.props.children, width);
  return Object.assign({}, component, { props: newProps });
}

export default Superficial;
