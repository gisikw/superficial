const STATIC_VALUES = ['auto', 'none', 'inherit'];
const SUPPORTED_UNITS = [
  'em', 'ex', 'rem', '%', 'px', 'vh', 'vw', 'vmin', 'vmax',
];

const unitPattern =
  new RegExp(`^(\\d+)(?:\\.\\d+)?(${
    SUPPORTED_UNITS.map(u => `(${u})`).join('|')
  })?$`);

function transform(node) {
  return Object.keys(node).reduce((h, key) => (
    Object.assign({}, h, {
      [key]: isGeneric(node[key])
        ? node[key]
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
  return (v = 0) => {
    const expanded = expandRules(node);
    Object.keys(expanded).forEach((key) => {
      if (typeof expanded[key] === 'object') {
        const bounds =
          Object.keys(expanded[key]).map(k =>
            parseInt(k, 10)).sort((a, b) => a - b);
        if (v < bounds[0]) {
          expanded[key] = expanded[key][bounds[0]];
        } else if (v > bounds[bounds.length - 1]) {
          expanded[key] = expanded[key][bounds[bounds.length - 1]];
        } else {
          const upperBound = bounds.find(b => b > v);
          const lowerBound = bounds[bounds.indexOf(upperBound) - 1];
          const delta = (v - lowerBound) / (upperBound - lowerBound);
          expanded[key] = interpolateValues(
            expanded[key][lowerBound],
            expanded[key][upperBound],
            delta,
          );
        }
      }
    });
    return expanded;
  };
}

function expandRules(rules) {
  return Object.keys(rules).reduce((o, key) => {
    if (isNumeric(key)) {
      return Object.assign({}, o,
        ...Object.keys(rules[key]).map(prop => ({
          [prop]: Object.assign({}, o[prop], {
            [key]: rules[key][prop],
          }),
        })),
      );
    }
    return Object.assign({}, o, { [key]: rules[key] });
  }, {});
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

// FIXME: This has been muddied up to ensure the result is always a function.
// Clean up the cruft to avoid the wrapping
export default (node) => {
  const result = transform({ t: node }).t;
  return typeof result === 'function' ? result : () => result;
};
