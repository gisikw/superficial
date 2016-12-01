[![Build Status](https://travis-ci.org/gisikw/superficial.svg?branch=master)](https://travis-ci.org/gisikw/superficial)
[![Test Coverage](https://codeclimate.com/github/gisikw/superficial/badges/coverage.svg)](https://codeclimate.com/github/gisikw/superficial/coverage)
[![Code Climate](https://codeclimate.com/github/gisikw/superficial/badges/gpa.svg)](https://codeclimate.com/github/gisikw/superficial)
[![NPM Version](https://img.shields.io/npm/v/superficial.svg)](https://www.npmjs.com/package/superficial)

# Superficial

Superficial is a library for managing inline responsive styles with React.

## Example

```jsx
import React from 'react';
import Superficial from 'superficial';

class MyComponent extends React.Component {
  render() {
    <div>
      <h1 looks={this.looks.header}>
        This is an example
      </h1>
    </div>
  }
}

MyComponent.looks = {
  header: {
    400: {
      margin: '0 auto',
    },
    600: {
      margin: '30px auto',
    }
  }
};

export default Superficial(MyComponent);
```

```jsx
<MyComponent width={500} />
// Yields the following HTML:
// <div>
//   <h1 style="margin: 15px auto">
//     This is an example
//   </h1>
// </div>
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/gisikw/superficial

## License

The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
