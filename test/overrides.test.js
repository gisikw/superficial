import tape from 'tape';
import React from 'react';
import { render } from 'enzyme';
import Superficial from '../src';

const test = (name, cb) => tape(name, t =>
  cb(Object.assign({}, t, {
    equalsIgnoringWhitespace: (a, b) =>
      t.equals(a.replace(/\s/g, ''), b.replace(/\s/g, '')),
  })),
);

test('Stateless components will merge a _looksOverride prop', (assert) => {
  const FooComponent = (_, looks) => (
    <div looks={looks.foo}>
      <div looks={looks.bar} />
    </div>
  );
  FooComponent.looks = {
    foo: { fontSize: '16px' },
    bar: { color: 'blue' },
  };
  const overrides = { bar: { color: 'red' } };
  const Wrapped = Superficial(FooComponent);
  assert.equalsIgnoringWhitespace(
    render(<Wrapped __looksOverride={overrides} />).html(),
    `<div style="font-size: 16px;">
      <div style="color: red;"></div>
    </div>`,
  );
  assert.end();
});

test('Stateful components will merge a _looksOverride prop', (assert) => {
  class FooComponent extends React.Component {
    render() {
      return (
        <div looks={this.looks.foo}>
          <div looks={this.looks.bar} />
        </div>
      );
    }
  }
  FooComponent.looks = {
    foo: { fontSize: '16px' },
    bar: { color: 'blue' },
  };
  const overrides = { bar: { color: 'red' } };
  const Wrapped = Superficial(FooComponent);
  assert.equalsIgnoringWhitespace(
    render(<Wrapped __looksOverride={overrides} />).html(),
    `<div style="font-size: 16px;">
      <div style="color: red;"></div>
    </div>`,
  );
  assert.end();
});
