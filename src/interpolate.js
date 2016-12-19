const PRECISION = 100;
const STATIC_VALUES = ['auto', 'none', 'inherit'];
const SUPPORTED_UNITS = [
  'em', 'ex', 'rem', '%', 'px', 'vh', 'vw', 'vmin', 'vmax',
];
const UNIT_PATTERN =
  new RegExp(`(\\d+)(?:\\.\\d+)?(${
    SUPPORTED_UNITS.map(u => `(${u})`).join('|')
  })?`, 'g');
const SINGLE_UNIT = new RegExp(`^${UNIT_PATTERN.source}$`);

function interpolate(rules, width) {
  return Object.assign({}, rules, ...Object.keys(rules).map((key) => {
    // Do not override for non-object CSS values
    if (typeof rules[key] !== 'object') return null;
    const bounds = sortedBounds(rules[key]);

    // Use the smallest breakpoint value if below
    if (width <= bounds[0]) return { [key]: rules[key][bounds[0]] };

    // Use the largest breakpoint value if above
    const last = bounds[bounds.length - 1];
    if (width >= last) return { [key]: rules[key][last] };

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

function interpolateValues(a, b, x) {
  // Linearly interpolate plain numbers
  if (isNumeric(a) && isNumeric(b)) return linearlyInterpolate(a, b, x);

  // Allow static values (auto, inherit, etc) to trump all else
  const staticMatch = STATIC_VALUES.find(v => a === v || b === v);
  if (staticMatch) return staticMatch;

  // Append the appropriate unit to the interpolated plain numbers
  const unit = units(a) || units(b);
  if (unit) return interpolateValues(parseFloat(a), parseFloat(b), x) + unit;

  // Recurse on each supported value
  const bMatches = b.match(UNIT_PATTERN);
  return a.replace(UNIT_PATTERN,
                   m => interpolateValues(m, bMatches.shift(), x));
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

function linearlyInterpolate(a, b, x) {
  const aFloat = parseFloat(a);
  return round(aFloat + ((parseFloat(b) - aFloat) * x));
}

function isNumeric(s) { return !isNaN(parseFloat(s)) && isFinite(s); }

function units(s) { return (`${s}`.match(SINGLE_UNIT) || [])[2]; }

function round(n) { return Math.round(n * PRECISION) / PRECISION; }

function sortedBounds(obj) {
  return Object.keys(obj).map(k => parseInt(k, 10)).sort((a, b) => a - b);
}

export default node => (width = 0) => interpolate(expandLookRules(node), width);
