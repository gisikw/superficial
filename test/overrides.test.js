import test from 'tape';
import React from 'react';
import { shallow } from 'enzyme';
import Superficial from '../src';

test('Stateless components will merge a _looksOverride prop', (assert) => {
  const FooComponent = (_, looks) => (
    <div id="outer" looks={looks.foo}>
      <div id="inner" looks={looks.bar} />
    </div>
  );
  FooComponent.looks = { foo: { color: 'green' }, bar: { color: 'blue' } };
  const Component = Superficial(FooComponent);
  const overrides = { bar: { color: 'red' } };
  const wrapped = shallow(<Component __looksOverride={overrides} />);
  assert.equal(wrapped.find('#inner').prop('style').color, 'red');
  assert.equal(wrapped.find('#outer').prop('style').color, 'green');
  assert.end();
});

test('Stateful components will merge a _looksOverride prop', (assert) => {
  class FooComponent extends React.Component {
    render() {
      return (
        <div id="outer" looks={this.looks.foo}>
          <div id="inner" looks={this.looks.bar} />
        </div>
      );
    }
  }
  FooComponent.looks = { foo: { color: 'green' }, bar: { color: 'blue' } };
  const Component = Superficial(FooComponent);
  const overrides = { bar: { color: 'red' } };
  const wrapped = shallow(<Component __looksOverride={overrides} />);
  assert.equal(wrapped.find('#inner').prop('style').color, 'red');
  assert.equal(wrapped.find('#outer').prop('style').color, 'green');
  assert.end();
});
