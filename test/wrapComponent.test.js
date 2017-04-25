import test from 'tape';
import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import superficial from '../src';

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
  const Component = superficial(FooComponent);
  const wrapper = shallow(<Component />);
  const renderedStyle = wrapper.find('#test').prop('style');
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
  const Component = superficial(FooComponent);
  const wrapper = shallow(<Component />);
  assert.equal(wrapper.find('h1').prop('style').color, '#fcc');
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
  const Component = superficial(FooComponent);
  const wrapper = shallow(<Component width={1} />);
  assert.equal(wrapper.find('h1').prop('style').margin, '5px auto');
  assert.end();
});

test('Stateless functions are supported', (assert) => {
  function FooComponent() {
    return (
      <div>
        <h1 looks={FooComponent.looks.foo}>Test</h1>
      </div>
    );
  }
  FooComponent.looks = { foo: {
    0: { margin: '0 auto' },
    2: { margin: '10px auto' },
  } };
  const Component = superficial(FooComponent);
  const wrapper = shallow(<Component width={1} />);
  assert.equal(wrapper.find('h1').prop('style').margin, '5px auto');
  assert.end();
});

test('Enhanced component uses displayName where possible', (assert) => {
  // eslint-disable-next-line react/prefer-stateless-function
  class FooComponent extends React.Component {
    render() { return <div />; }
  }
  const Component = superficial(FooComponent);
  const wrapper = shallow(<div><Component width={1} /></div>);
  assert.ok(wrapper.find('FooComponent').length);
  assert.end();
});

test('Components can refer to undefined looks without crashing', (assert) => {
  class FooComponent extends React.Component {
    render() { return <div looks={this.looks.foo} />; }
  }
  const BarComponent = () => <div looks={BarComponent.looks.bar} />;
  let Component = superficial(FooComponent);
  shallow(<Component />);
  Component = superficial(BarComponent);
  shallow(<Component />);
  assert.end();
});

test('Enhanced components expose underlying looks', (assert) => {
  // eslint-disable-next-line react/prefer-stateless-function
  class FooComponent extends React.Component { render() { return <div />; } }
  const BarComponent = () => <div />;
  FooComponent.looks = { foo: { height: { 50: '50px' } } };
  BarComponent.looks = { bar: { height: { 50: '50px' } } };
  assert.deepEqual(superficial(FooComponent).looks, {
    foo: { height: [[0, '0'], [50, '50px']] },
  });
  assert.deepEqual(superficial(BarComponent).looks, {
    bar: { height: [[0, '0'], [50, '50px']] },
  });
  assert.end();
});

test('Wrapped components extend the source propTypes', (assert) => {
  // eslint-disable-next-line react/prefer-stateless-function
  class FooComponent extends React.Component { render() { return <div />; } }
  const BarComponent = () => <div />;
  FooComponent.propTypes = { foo: true };
  BarComponent.propTypes = { bar: true };
  assert.deepEqual(superficial(FooComponent).propTypes, {
    width: PropTypes.number,
    foo: true,
  });
  assert.deepEqual(superficial(BarComponent).propTypes, {
    width: PropTypes.number,
    bar: true,
  });
  assert.end();
});
