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
          <button onClick={() => this.setState({ active: true })}>
            Activate
          </button>
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
    `<div style="font-weight: bold; font-size: 16px; color: #fcc;">
      This is a Foo Component
      <button>Activate</button>
    </div>`,
  );

  assert.end();
});
