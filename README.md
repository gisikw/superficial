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

Superficial's strength comes from the ability to express your component's look
as a function of its own width (rather than the document width, as with media
queries). Where this really shines is in the ability to determine the width
value of child components, as in the following example:

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
  </DocumentListener>,
  document.getElementById('root')
);
```

Now your `App` component will have a width property that matches the
`clientWidth` of the browser page.

## Special cases

There are a few cases where the Superficial library makes some assumptions
about what you intend, where otherwise things might be ambiguous. In the
examples below, we show what the resulting value is exactly between two
breakpoints. Note that the `between` function does not exist; it is provided
solely to illustrate the library's behavior in certain cases.

### CSS shorthand expressions
```js
between('5px auto', '15px auto')             // '10px auto'
between('rgb(0, 0, 0)', 'rgb(50, 150, 250)') // 'rgb(25, 75, 125)'
between('5px 20px 0', '10px 30px')           // ERROR!
```

Superficial will interpolate all the values in your string, allowing you to use
shorthand CSS values. The library is agnostic to what format you use, and will
simply pull out the values from each breakpoint. The format, however, needs to
be the consistent for a given CSS property. Mixing different types of shortand
(`margin: { 100: '15px auto', 400: '20px 5px 10px' }`) is not supported.

### Single-Breakpoint expressions
```js
height: { 500: '100px', 0: 0 }; // Standard definition
height: { 500: '100px' };       // Syntactic shortcut
```

Frequently, it may be valuable to express a single breakpoint, assuming a
linear responsiveness for values below. If a property is specified for a given
width, it can be assumed that it should scale proportionally below that width.
If a single breakpoint is provided, Superficial will treat the expression as
though there were an additional breakpoint at `0` width for which the property
value is 0.

### Mixing unit and unitless values
```js
between(0, '15px') // '7.5px'
between(5, '20em') // '12.5em'
```

If you use a value without a unit (for example, `border: 0`), and at a
different width, provide a value *with* a unit, Superficial will assume it
should use the unit throughout that range. So if the nearest neighbor is
`border: '15px'`, pixel values will be used in-between.

### Mixing different units

```js
between('15px', '-20%')  // 'calc(7.5px + (10%))'
between('25vw', '42rem') // 'calc(12.5vw + (21rem))'
```

If you mix units, Superficial will try to handle this gracefully using the [CSS
calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) function. Note
that this may not be supported in legacy browsers, so we recommend you use the
same units across breakpoints.

### Using "static" values

```js
between('15px auto', '0px 5px') // '7.5px auto'
between('15px', 'inherit')      // 'inherit'
between('none', '30%')          // 'none'
```

Values like `auto`, `inherit`, and `none` don't really make much sense as part
of a range of values. If you choose to use them, they will take precedence over
their counterparts.

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
