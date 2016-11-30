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

test('Components can specify looks inline', (assert) => {
  class FooComponent extends React.Component {
    render() {
      return (
        <div
          looks={[this.looks.foo, this.looks.bar]}
          style={{ color: '#fcc' }}
        >
          This is a Foo Component
        </div>
      );
    }
  }

  FooComponent.looks = {
    foo: { fontSize: '16px' },
    bar: { fontWeight: 'bold' },
  };

  const Wrapped = Superficial(FooComponent);
  assert.equalsIgnoringWhitespace(
    render(<Wrapped />).html(),
    `<div style="font-weight:bold; font-size:16px; color:#fcc;">
      This is a Foo Component
    </div>`,
  );

  assert.end();
});

test('Components can specify looks on children', (assert) => {
  class FooComponent extends React.Component {
    render() { return <div><h1 looks={this.looks.foo}>Test</h1></div>; }
  }
  FooComponent.looks = { foo: { color: '#fcc' } };

  const Wrapped = Superficial(FooComponent);
  assert.equalsIgnoringWhitespace(
    render(<Wrapped />).html(),
    `<div>
      <h1 style="color: #fcc;">Test</h1>
    </div>`,
  );

  assert.end();
});
