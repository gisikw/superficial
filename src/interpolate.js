import {
  PRECISION, STATIC_VALUES, SINGLE_UNIT, VALUE_PATTERN
} from './constants';

function interpolate(rules, width) {
  return Object.keys(rules).reduce((acc, prop) => {
    let value = rules[prop];
    if (Array.isArray(value)) {
      const [ smallestWidth, smallestValue ] = value[0];
      const [ largestWidth, largestValue ]  = value[value.length - 1];
      if (width <= smallestWidth) value = smallestValue;
      else if (width >= largestWidth) value = largestValue;
      else {
        const upper = value.find(([w]) => w > width);
        const [ lW, lV ] = value[value.indexOf(upper) - 1];
        const [ uW, uV ] = upper;
        value = interpolateValues(lV, uV, (width - lW) / (uW - lW));
      }
    }
    return Object.assign(acc, { [prop]: value });
  }, {});
}

function interpolateValues(a, b, x) {
  // Linearly interpolate plain numbers
  if (isNumeric(a) && isNumeric(b)) return linearlyInterpolate(a, b, x);

  // Allow static values (auto, inherit, etc) to trump all else
  const staticMatch = STATIC_VALUES.find(v => a === v || b === v);
  if (staticMatch) return staticMatch;

  // Append the appropriate unit to the interpolated plain numbers
  const [aUnit, bUnit] = [a, b].map(units);
  if (aUnit || bUnit) {
    return (aUnit && bUnit && aUnit !== bUnit)
      ? interpolateWithCalc(a, b, x)
      : linearlyInterpolate(a, b, x) + (aUnit || bUnit);
  }

  // Recurse on each supported value
  const bMatches = b.match(VALUE_PATTERN);
  return a.replace(
    VALUE_PATTERN, m => interpolateValues(m, bMatches.shift(), x));
}

function linearlyInterpolate(a, b, x) {
  const aFloat = parseFloat(a);
  return round(aFloat + ((parseFloat(b) - aFloat) * x));
}

function interpolateWithCalc(a, b, x) {
  return `calc(${parseFloat(a) * (1 - x)}${units(a)} + ` +
         `(${parseFloat(b) * x}${units(b)}))`;
}

function isNumeric(s) { return !isNaN(parseFloat(s)) && isFinite(s); }

function units(s) { return (`${s}`.match(SINGLE_UNIT) || [])[2]; }

function round(n) { return Math.round(n * PRECISION) / PRECISION; }

function sortedBounds(obj) {
  return Object.keys(obj).map(k => parseInt(k, 10)).sort((a, b) => a - b);
}

export default node => (width = 0) => interpolate(node, width);
