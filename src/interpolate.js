const STATIC_VALUES = ['auto'];
const SUPPORTED_UNITS = [
  'em', 'ex', 'rem', '%', 'px', 'vh', 'vw', 'vmin', 'vmax',
];

const unitPattern =
  new RegExp(`^(\\d+)(?:\\.\\d+)?(${
    SUPPORTED_UNITS.map(u => `(${u})`).join('|')
  })?$`);

function transform(node) {
  if (typeof node !== 'object') return node;
  return Object.keys(node).reduce((h, key) => (
    Object.assign({}, h, {
      [key]: isGeneric(node[key])
        ? transform(node[key])
        : makeResolver(node[key]) })
  ), {});
}

function isGeneric(node) {
  return typeof node !== 'object' || !Object.keys(partition(node)[1]).length;
}

function partition(node) {
  return Object.keys(node).reduce((a, key) => {
    const r = [];
    r[0] = a[0];
    r[1] = a[1];
    r[isNumeric(key) ? 1 : 0][key] = node[key]; return r;
  }, [{}, {}]);
}

function isNumeric(s) {
  return !isNaN(parseFloat(s)) && isFinite(s);
}

function makeResolver(node) {
  const [generics, dynamics] = partition(node);
  const doMerge = (typeof dynamics[Object.keys(dynamics)[0]] === 'object');
  const bounds =
    Object.keys(dynamics).map(k => parseInt(k, 10)).sort((a, b) => a - b);
  return (v = 0) => {
    if (dynamics[v]) {
      return doMerge ? Object.assign({}, generics, dynamics[v]) : dynamics[v];
    }
    let interpolated;
    if (v < bounds[0]) {
      interpolated = dynamics[bounds[0]];
    } else if (v > bounds[bounds.length - 1]) {
      interpolated = dynamics[bounds[bounds.length - 1]];
    } else {
      const upperBound = bounds.find(b => b > v);
      const lowerBound = bounds[bounds.indexOf(upperBound) - 1];
      const delta = (v - lowerBound) / (upperBound - lowerBound);
      interpolated = doMerge
        ? interpolate(dynamics[lowerBound], dynamics[upperBound], delta)
        : interpolateValues(dynamics[lowerBound], dynamics[upperBound], delta);
    }
    return doMerge ? Object.assign({}, generics, interpolated) : interpolated;
  };
}

function interpolate(a, b, x) {
  return Object.keys(a).reduce((h, key) =>
    Object.assign({}, h, { [key]: interpolateValues(a[key], b[key], x) }), {});
}

function interpolateValues(a, b, x) {
  if (isNumeric(a) && isNumeric(b)) return a + ((b - a) * x);
  const unitMatch = a.match(unitPattern);
  if (unitMatch) {
    const unit = unitMatch[2] || b.match(unitPattern)[2] || '';
    const aFloat = parseFloat(a);
    return (aFloat + ((parseFloat(b) - aFloat) * x)) + unit;
  }
  if (STATIC_VALUES.indexOf(a) !== -1) return a;
  const bTokens = b.split(/\s+/);
  return a.split(/\s+/)
          .map((t, i) => interpolateValues(t, bTokens[i], x))
          .join(' ');
}

export default node => transform({ t: node }).t;
