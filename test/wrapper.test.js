import test from 'tape';
import React from 'react';
import { shallow, render } from 'enzyme';
import Superficial from '../src';

test('Superficial returns valid React components', (assert) => {
  const Header = () => <h1>Header</h1>;
  const Wrapped = Superficial(Header);
  shallow(<Wrapped />);
  assert.pass('Superficial return value is renderable');
  assert.end();
});

test('The intended hijack proof-of-concept works', (assert) => {
  const Header = () => <h1 style={['stuff', 'nonsense']}>Header</h1>;

  const Wrapped = () => {
    const header = Object.assign({}, Header());
    header.props = Object.assign({}, header.props);
    header.props.style = { margin: '0 auto' };
    return header;
  };

  assert.equal(
    render(<Header />).html(),
    '<h1 style="0:stuff;1:nonsense;">Header</h1>',
  );
  assert.equal(
    render(<Wrapped />).html(),
    '<h1 style="margin:0 auto;">Header</h1>',
  );
  assert.end();
});
