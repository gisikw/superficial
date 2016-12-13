[![Travis Status][trav_img]][trav_site]
[![Test Coverage][cov_img]][cov_site]
[![Code Climate][code_img]][code_site]
[![NPM Package][npm_img]][npm_site]

# Superficial

```
npm install superficial
```

A library for managing responsive inline styles on React components.

Superficial allows you to define CSS rules at explicit widths. It automatically
generates the values in-between!

## Usage

Superficial allows you to define "looks" that are applied to parts of your
components. These looks behave like CSS blocks, except you can specify values
for explicit widths. Wrap your component with `superficial()` before you export
it, and pass in a `width` prop. Superficial will calculate the right CSS
attributes for whatever width you provide!

```jsx
import React from 'react';
import superficial from 'superficial';

class MyComponent extends React.Component {
  render() {
    return (
      <h1 looks={[this.looks.header, this.looks.base]}>
        Let's Be Superficial!
      </h1>
    );
  }
}

MyComponent.looks = {
  header: {
    // We want the font-size to be 12px when the component is 200 pixels wide,
    // but 20px when the component is 400 pixels wide.
    fontSize: { 200: '12px', 400: '20px' },
  },

  base: {
    // You can also group properties by specifying the width first
    200: {
      // Use your favorite shorthand properties. Superficial will interpolate
      // the values individually
      margin: '0px auto',
      padding: '16px 12px 4px',
    },
    400: {
      margin: '16px auto',
      padding: '8px 18px 14px',
    },
  },
};

export default superficial(MyComponent);
```

In this example, we specified CSS properties for when the component is 200px
wide and 400px wide. But if we pass it an intermediary value, it computes the
values for us!

```jsx
<MyComponent width={300} />
```

The resulting HTML looks like this:

```html
<h1 style="font-size: 16px; margin: 8px auto; padding: 12px 15px 9px">
  Let's Be Superficial!
</h1>
```

## Where does the width come from?

Writing style rules in terms of the component width is useful, but how do you
determine the width to begin with?

You may wish to compute widths inside a parent component, as in the following
example:

```jsx
function SideBySide(props) {
  return (
    <MyComponent width={props.width / 2} />
    <MyComponent width={props.width / 2} />
  );
}
```

Superficial also provides a small `<DocumentListener />` component that will
automatically pass down the browser width to its children (and listen for any
resizing). You can use it like this:

```jsx
ReactDOM.render(
  <DocumentListener>
    <App />
  </DocumentListener>
  document.getElementById('root')
);
```

Now your `App` component will have a width property that matches the
`clientWidth` of the browser page.

## Contributing

Bug reports and pull requests are welcome on GitHub at
https://github.com/gisikw/superficial

## License

The library is available as open source under the terms of the [MIT
License](http://opensource.org/licenses/MIT).

[trav_img]: https://api.travis-ci.org/gisikw/superficial.svg
[trav_site]: https://travis-ci.org/gisikw/superficial
[cov_img]: https://codeclimate.com/github/gisikw/superficial/badges/coverage.svg
[cov_site]: https://codeclimate.com/github/gisikw/superficial/coverage
[code_img]: https://codeclimate.com/github/gisikw/superficial/badges/gpa.svg
[code_site]: https://codeclimate.com/github/gisikw/superficial
[npm_img]: https://img.shields.io/npm/v/superficial.svg
[npm_site]: https://www.npmjs.com/package/superficial
