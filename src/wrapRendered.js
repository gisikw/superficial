import interpolate from './interpolate';

const NO_AUTO_COPY_PROPS = ['looks', 'style', 'children'];

function applyStyles(renderedComponent, width) {
  // props.children can be components or Arrays. Make recursion easier
  if (Array.isArray(renderedComponent)) {
    return renderedComponent.map(c => applyStyles(c, width));
  }

  // Stop recursing when we reach the bottom of child components
  if (!renderedComponent.props) return renderedComponent;

  return Object.assign({}, renderedComponent, {
    props: buildRenderedProps(renderedComponent, width),
  });
}

function buildRenderedProps(renderedComponent, width) {
  return Object.keys(renderedComponent.props).reduce((o, k) => (
    NO_AUTO_COPY_PROPS.indexOf(k) === -1
      ? Object.assign({}, o, { [k]: renderedComponent.props[k] }) : o
  ), {
    style: buildStyleDefinition(renderedComponent)(width),
    children: applyStyles(renderedComponent.props.children, width),
  });
}

function buildStyleDefinition(renderedComponent) {
  return interpolate(Object.assign({},
    mergeLooks(renderedComponent),
    renderedComponent.props.style,
  ));
}

function mergeLooks(renderedComponent) {
  return Array.isArray(renderedComponent.props.looks)
    ? renderedComponent.props.looks.reduce(
        (o, look) => Object.assign({}, o, look), {})
    : renderedComponent.props.looks;
}

export default applyStyles;
