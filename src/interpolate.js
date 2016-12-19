const PRECISION = 10;
const STATIC_VALUES = ['auto', 'none', 'inherit'];
const SUPPORTED_UNITS = [
  'em', 'ex', 'rem', '%', 'px', 'vh', 'vw', 'vmin', 'vmax',
];
const UNIT_PATTERN =
  new RegExp(`^(\\d+)(?:\\.\\d+)?(${
    SUPPORTED_UNITS.map(u => `(${u})`).join('|')
  })?$`);

function interpolate(rules, width) {
  return Object.assign({}, rules, ...Object.keys(rules).map((key) => {
    // Do not override for non-object CSS values
    if (typeof rules[key] !== 'object') return null;

    const bounds = sortedBounds(rules[key]);
    // Use the smallest breakpoint value if below
    if (width <= bounds[0]) return { [key]: rules[key][bounds[0]] };

    // Use the largest breakpoint value if below
    if (width >= bounds[bounds.length - 1]) {
      return { [key]: rules[key][bounds[bounds.length - 1]] };
    }

    // Interpolate values between the nearest neighbors
    const upperBound = bounds.find(b => b > width);
    const lowerBound = bounds[bounds.indexOf(upperBound) - 1];
    return { [key]: interpolateValues(
      rules[key][lowerBound],
      rules[key][upperBound],
      (width - lowerBound) / (upperBound - lowerBound),
    ) };
  }));
}

// Split out grouped breakpoint rules into individual properties
export function expandLookRules(rules) {
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
  if (isNumeric(a) && isNumeric(b)) return round(a + ((b - a) * x));
  const unitMatch = `${a}`.match(UNIT_PATTERN);
  if (unitMatch) {
    const unit = unitMatch[2] || b.match(UNIT_PATTERN)[2] || '';
    const aFloat = parseFloat(a);
    return round(aFloat + ((parseFloat(b) - aFloat) * x)) + unit;
  }
  if (STATIC_VALUES.includes(a)) return a;
  const bTokens = b.split(/\s+/);
  return a.split(/\s+/)
          .map((t, i) => interpolateValues(t, bTokens[i], x))
          .join(' ');
}

function isNumeric(s) { return !isNaN(parseFloat(s)) && isFinite(s); }

function round(n) { return Math.round(n * PRECISION) / PRECISION; }

function sortedBounds(obj) {
  return Object.keys(obj).map(k => parseInt(k, 10)).sort((a, b) => a - b);
}

export default node => (width = 0) => interpolate(expandLookRules(node), width);
