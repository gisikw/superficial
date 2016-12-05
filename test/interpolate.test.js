import test from 'tape';
import interpolate, { expandLookRules } from '../src/interpolate';

test('interpolate leaves plain object alone', (assert) => {
  const styles = { color: '#fff' };
  assert.deepEqual(interpolate(styles)(), styles);
  assert.end();
});

test('interpolate generates functions from tweenable styles', (assert) => {
  const style = interpolate({
    color: '#fff',
    100: { lineHeight: 1 },
    300: { lineHeight: 2 },
    500: { lineHeight: 12 },
  });
  assert.deepEqual(style(0), { color: '#fff', lineHeight: 1 });
  assert.deepEqual(style(200), { color: '#fff', lineHeight: 1.5 });
  assert.deepEqual(style(400), { color: '#fff', lineHeight: 7 });
  assert.deepEqual(style(600), { color: '#fff', lineHeight: 12 });
  assert.end();
});

test('interpolate supports values with units', (assert) => {
  const style = interpolate({
    0: {
      em: '0em',
      ex: '0ex',
      rem: '0rem',
      '%': '0%',
      px: '0px',
      vh: '0vh',
      vw: '0vw',
      vmin: '0vmin',
      vmax: '0vmax',
    },
    2: {
      em: '2em',
      ex: '2ex',
      rem: '2rem',
      '%': '2%',
      px: '2px',
      vh: '2vh',
      vw: '2vw',
      vmin: '2vmin',
      vmax: '2vmax',
    },
  });
  assert.deepEqual(style(1), {
    em: '1em',
    ex: '1ex',
    rem: '1rem',
    '%': '1%',
    px: '1px',
    vh: '1vh',
    vw: '1vw',
    vmin: '1vmin',
    vmax: '1vmax',
  });
  assert.end();
});

test('interpolate supports CSS shorthand properties', (assert) => {
  const style = interpolate({
    0: { margin: '0 10px 2em 5%' }, 2: { margin: '10px 0px 1em 0' },
  });
  assert.deepEqual(style(1), { margin: '5px 5px 1.5em 2.5%' });
  assert.end();
});

test('interpolate allows keyword values in CSS shorthand', (assert) => {
  const style = interpolate({
    0: { margin: '10px auto none inherit' },
    2: { margin: '20px auto none inherit' },
  });
  assert.deepEqual(style(1), { margin: '15px auto none inherit' });
  assert.end();
});

test('interpolate allows selective properties in breakpoints', (assert) => {
  const style = interpolate({
    0: { margin: '0px' },
    10: { fontSize: '10px' },
    20: { margin: '20px', fontSize: '20px' },
  });
  assert.deepEqual(style(15), {
    margin: '15px',
    fontSize: '15px',
  });
  assert.end();
});

test('interpolate allows specifying breakpoints as properties', (assert) => {
  const style = interpolate({
    margin: { 0: '0px', 20: '20px' },
  });
  assert.deepEqual(style(15), { margin: '15px' });
  assert.end();
});

test('expandLookRules flattens grouped looks', (assert) => {
  const rules = {
    margin: { 100: 100, 200: 200 },
    100: { width: 100, height: 100 },
    200: { width: 200, height: 200 },
  };
  assert.deepEqual(expandLookRules(rules), {
    margin: { 100: 100, 200: 200 },
    width: { 100: 100, 200: 200 },
    height: { 100: 100, 200: 200 },
  });
  assert.end();
});
