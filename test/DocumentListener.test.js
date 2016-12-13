import test from 'tape';
import React from 'react';
import { shallow } from 'enzyme';
import { DocumentListener } from '../src';

test('DocumentListener passes document width to children', (assert) => {
  global.document = { documentElement: { clientWidth: 123 } };
  const wrapper = shallow(
    <DocumentListener>
      <div id="child" />
    </DocumentListener>,
  );
  assert.equal(wrapper.find('#child').prop('width'), 123);
  delete global.document;
  assert.end();
});

test('DocumentListener supports an array of children', (assert) => {
  global.document = { documentElement: { clientWidth: 123 } };
  const wrapper = shallow(
    <DocumentListener>
      <div id="child1" />
      <div id="child2" />
    </DocumentListener>,
  );
  assert.equal(wrapper.find('#child1').prop('width'), 123);
  assert.equal(wrapper.find('#child2').prop('width'), 123);
  delete global.document;
  assert.end();
});

test('DocumentListener listens to the global resize event', (assert) => {
  let added;
  let removed;
  global.removeEventListener = event => (removed = event);
  global.addEventListener = (event, cb) => { added = event; cb(); };
  global.document = { documentElement: { clientWidth: 123 } };
  const wrapper = shallow(
    <DocumentListener><div /></DocumentListener>,
  );
  wrapper.instance().componentDidMount();
  wrapper.instance().componentWillUnmount();
  assert.equal(added, 'resize');
  assert.equal(removed, 'resize');
  delete global.addEventListener;
  delete global.removeEventListener;
  delete global.document;
  assert.end();
});
