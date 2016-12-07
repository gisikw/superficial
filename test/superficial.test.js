import tape from 'tape';
import React from 'react';
import { shallow } from 'enzyme';
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
      const looks = [this.looks.foo, this.looks.bar];
      return (
        <div id="test" looks={looks} style={{ fontWeight: 'bold' }}>
          This is a Foo Component
        </div>
      );
    }
  }
  FooComponent.looks = { foo: { fontSize: '16px' }, bar: { color: '#fcc' } };
  const Component = Superficial(FooComponent);
  const wrapped = shallow(<Component />);
  const renderedStyle = wrapped.find('#test').prop('style');
  assert.deepEqual(
    renderedStyle,
    { color: '#fcc', fontWeight: 'bold', fontSize: '16px' },
  );
  assert.end();
});

test('Components can specify looks on children', (assert) => {
  class FooComponent extends React.Component {
    render() { return <div><h1 looks={this.looks.foo}>Test</h1></div>; }
  }
  FooComponent.looks = { foo: { color: '#fcc' } };
  const Component = Superficial(FooComponent);
  const wrapped = shallow(<Component />);
  assert.equal(wrapped.find('h1').prop('style').color, '#fcc');
  assert.end();
});

test('Components support interpolated styles', (assert) => {
  class FooComponent extends React.Component {
    render() {
      return (
        <div>
          <h1 looks={this.looks.foo}>Test</h1>
          <h2>Force children to be an array</h2>
        </div>
      );
    }
  }
  FooComponent.looks = { foo: {
    0: { margin: '0 auto' },
    2: { margin: '10px auto' },
  } };
  const Component = Superficial(FooComponent);
  const wrapped = shallow(<Component width={1} />);
  assert.equal(wrapped.find('h1').prop('style').margin, '5px auto');
  assert.end();
});

test('Stateless functions are supported', (assert) => {
  const FooComponent = (_, looks) => <div><h1 looks={looks.foo}>Test</h1></div>;
  FooComponent.looks = { foo: {
    0: { margin: '0 auto' },
    2: { margin: '10px auto' },
  } };
  const Component = Superficial(FooComponent);
  const wrapped = shallow(<Component width={1} />);
  assert.equal(wrapped.find('h1').prop('style').margin, '5px auto');
  assert.end();
});

test('React.createClass is supported', (assert) => {
  // eslint-disable-next-line react/prefer-es6-class
  const FooComponent = React.createClass({
    render() { return <div><h1 looks={this.looks.foo}>Test</h1></div>; },
  });
  FooComponent.looks = { foo: {
    0: { margin: '0 auto' },
    2: { margin: '10px auto' },
  } };
  const Component = Superficial(FooComponent);
  const wrapped = shallow(<Component width={1} />);
  assert.equal(wrapped.find('h1').prop('style').margin, '5px auto');
  assert.end();
});
