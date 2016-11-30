function Superficial(Component) {
  if (!Component.render &&
      !(Component.prototype && Component.prototype.render)) {
    // Punt on stateless components for now
    return Component;
  }

  class Enhanced extends Component {
    render() {
      let result = super.render();
      if (result.props.looks) {
        const style = Object.assign({},
          Array.isArray(result.props.looks)
            ? result.props.looks.reduce((look, h) =>
                Object.assign({}, h, look), {})
            : result.props.looks,
          result.props.style,
        );
        const newProps = { style };
        Object.keys(result.props).forEach((k) => {
          if (k !== 'looks' && k !== 'style') newProps[k] = result.props[k];
        });
        result = Object.assign({}, result, { props: newProps });
      }
      return result;
    }
  }

  Enhanced.prototype.looks = Component.looks;
  return Enhanced;
}

export default Superficial;
