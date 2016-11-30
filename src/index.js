function Superficial(Component) {
  // Punt on stateless components for now
  if (!Component.render &&
      !(Component.prototype && Component.prototype.render)) {
    return Component;
  }

  class Enhanced extends Component {
    render() { return lookify(super.render()); }
  }
  Enhanced.prototype.looks = Component.looks;
  return Enhanced;
}

function lookify(component) {
  if (!component.props ||
      (!component.props.looks && !component.props.children)) return component;
  const style = Object.assign({},
    Array.isArray(component.props.looks)
      ? component.props.looks.reduce((look, h) =>
          Object.assign({}, h, look), {})
      : component.props.looks,
    component.props.style,
  );
  const newProps = { style };
  Object.keys(component.props).forEach((k) => {
    if (k !== 'looks' && k !== 'style' && k !== 'children') {
      newProps[k] = component.props[k];
    }
  });
  if (Array.isArray(component.props.children)) {
    newProps.children = component.props.children.map(lookify);
  } else newProps.children = lookify(component.props.children);
  return Object.assign({}, component, { props: newProps });
}

export default Superficial;
