import React from 'react';

function Superficial(Component) {
  // eslint-disable-next-line react/prefer-stateless-function
  class Enhanced extends Component {}
  Enhanced.prototype.looks = Component.looks;
  return props => React.createElement(Enhanced, props);
}

export default Superficial;
