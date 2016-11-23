import test from 'tape';
import React from 'react';
import { shallow } from 'enzyme';
import Superficial from '../src';

test('Superficial returns valid React components', (assert) => {
  shallow(Superficial(<div />));
  assert.pass('Superficial return value is renderable');
  assert.end();
});
