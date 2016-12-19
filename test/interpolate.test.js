import test from 'tape';
import { interpolate } from '../src';
import { expandLookRules } from '../src/interpolate';

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
  assert.deepEqual(style(500), { color: '#fff', lineHeight: 12 });
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
    0: { margin: '10px auto none' },
    2: { margin: 'inherit 20px 13px' },
  });
  assert.deepEqual(style(1), { margin: 'inherit auto none' });
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

test('interpolate rounds values to the nearest hundredth', (assert) => {
  const style = interpolate({
    margin: { 0: '1px', 3: '2px' },
    padding: { 0: 1, 3: 2 },
  });
  assert.deepEqual(style(1), { margin: '1.33px', padding: 1.33 });
  assert.end();
});

test('interpolate gets unitless bounds from other bound', (assert) => {
  const style = interpolate({
    margin: { 0: 0, 10: '10px' },
    padding: { 0: '10em', 10: 2 },
  });
  assert.deepEqual(style(5), { margin: '5px', padding: '6em' });
  assert.end();
});

test('interpolate handles comma-delineated units', (assert) => {
  const style = interpolate({
    color: { 0: 'rgba(0, 0, 0, 0.5)', 2: 'rgba(100, 100, 100, 0)' },
  });
  assert.deepEqual(style(1), { color: 'rgba(50, 50, 50, 0.25)' });
  assert.end();
});

test('interpolate uses calc to resolve unit mismatches', (assert) => {
  const style = interpolate({
    margin: { 0: '5px', 2: '10em' },
    padding: { 0: '-12%', 2: '4px' },
    fontSize: { 0: '15vh', 2: '-20vw' },
  });
  assert.deepEqual(style(1), {
    margin: 'calc(2.5px + (5em))',
    padding: 'calc(-6% + (2px))',
    fontSize: 'calc(7.5vh + (-10vw))',
  });
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
