import test from 'tape';
import preprocess from '../src/preprocessor';

test('Preprocessor formats valid input', (assert) => {
  assert.plan(1);
  const look = {
    container: {
      color: 'red',
      margin: { 10: '10px', 0: '20px' },
      0: { padding: '10px', fontSize: '16px' },
      15: { padding: '20px', fontSize: '20px' },
    },
  };
  assert.deepEqual(preprocess(look).container, {
    fontSize: [[0, '16px'], [15, '20px']],
    padding: [[0, '10px'], [15, '20px']],
    margin: [[0, '20px'], [10, '10px']],
    color: 'red',
  });
});

test('Preprocessor adds zeros to single breakpoints', (assert) => {
  assert.plan(1);
  const look = { container: { margin: { 100: '50px' } } };
  assert.deepEqual(preprocess(look).container, {
    margin: [[0, '0'], [100, '50px']],
  });
});

test('Preprocessor formats zeroes to match arity', (assert) => {
  assert.plan(1);
  const look = { container: { margin: { 0: 0, 100: '100px 50px' } } };
  assert.deepEqual(preprocess(look).container, {
    margin: [[0, '0 0'], [100, '100px 50px']],
  });
});
