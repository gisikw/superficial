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
    constructor() {
      super();
      this.state = { active: false };
    }

    render() {
      const divLooks = [this.looks.container];
      if (this.state.active) divLooks.push(this.looks.active);
      return (
        <div looks={this.looks.container}>
          This is a Foo Component
          <button onClick={() => this.setState({ active: true })}>
            Activate
          </button>
        </div>
      );
    }
  }

  FooComponent.looks = {
    container: {
      fontSize: '16px',
    },
    active: {
      fontWeight: 'bold',
    },
  };

  const Wrapped = Superficial(FooComponent);
  assert.equalsIgnoringWhitespace(
    render(<Wrapped />).html(),
    `<div>
      This is a Foo Component
      <button>Activate</button>
    </div>`,
  );

  assert.end();
});
