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
          className="test"
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
    `<div style="font-weight:bold; font-size:16px; color:#fcc;" class="test">
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

test('Components support interpolated styles', (assert) => {
  class FooComponent extends React.Component {
    render() {
      return (
        <div>
          <h1 looks={this.looks.foo}>Test</h1>
          <h2>Stuff</h2>
        </div>
      );
    }
  }
  FooComponent.looks = { foo: {
    0: { margin: '0 auto' },
    2: { margin: '10px auto' },
  } };

  const Wrapped = Superficial(FooComponent);
  assert.equalsIgnoringWhitespace(
    render(<Wrapped width={1} />).html(),
    `<div>
      <h1 style="margin: 5px auto;">Test</h1>
      <h2>Stuff</h2>
    </div>`,
  );

  assert.end();
});

test('Stateless functions are supported', (assert) => {
  const FooComponent = (_, looks) => (
    <div>
      <h1 looks={looks.foo}>Test</h1>
    </div>
  );

  FooComponent.looks = { foo: {
    0: { margin: '0 auto' },
    2: { margin: '10px auto' },
  } };

  const Wrapped = Superficial(FooComponent);
  assert.equalsIgnoringWhitespace(
    render(<Wrapped width={1} />).html(),
    `<div>
      <h1 style="margin: 5px auto;">Test</h1>
    </div>`,
  );

  assert.end();
});

test('React.createClass is supported', (assert) => {
  const FooComponent = React.createClass({
    render() {
      return (
        <div>
          <h1 looks={this.looks.foo}>Test</h1>
        </div>
      );
    }
  });

  FooComponent.looks = { foo: {
    0: { margin: '0 auto' },
    2: { margin: '10px auto' },
  } };

  const Wrapped = Superficial(FooComponent);
  assert.equalsIgnoringWhitespace(
    render(<Wrapped width={1} />).html(),
    `<div>
      <h1 style="margin: 5px auto;">Test</h1>
    </div>`,
  );

  assert.end();
});
