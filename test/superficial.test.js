import test from 'tape';
import React from 'react';
import superficial from '../src';

test('Superficial wraps a valid React component', (assert) => {
  assert.doesNotThrow(() => superficial(() => <div />));
  assert.end();
});
