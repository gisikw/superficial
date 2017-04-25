import { VALUE_PATTERN } from './constants';

function preprocess(definition) {
  return Object.keys(definition).reduce((acc, name) => {
    let ruleSet = parseRuleSet(definition[name]);
    ruleSet = Object.keys(ruleSet).reduce((bcc, prop) =>
      Object.assign(bcc, { [prop]: sanitize(ruleSet[prop]) }), {});
    return Object.assign(acc, { [name]: ruleSet });
  }, {});
}

function sanitize(rule) {
  if (!Array.isArray(rule)) return rule;
  let result = rule;
  if (result.length === 1) result = result.concat([[0, 0]]);
  const nonZero = result.find(v => !isZero(v[1]));
  const zeros = nonZero
    ? nonZero[1].match(VALUE_PATTERN).map(() => '0').join(' ')
    : 0;
  result = result.map(([size, value]) =>
    [parseInt(size, 10), isZero(value) ? zeros : value ]);
  result = result.sort((a, b) => parseInt(a[0], 10) > parseInt(b[0], 10));
  return result;
}

function addRule(ruleSet, { prop, value, width }) {
  return Object.assign({}, ruleSet, {
    [prop]: width ? (ruleSet[prop] || []).concat([[width, value]]) : value,
  });
}

function parseRuleSet(definition) {
  return Object.keys(definition).reduce((acc, key) => {
    const value = definition[key];
    if (typeof value !== 'object') return addRule(acc, { prop: key, value });
    return Object.keys(value).reduce((bcc, inner) => {
      const [width, prop] = isNumeric(key) ? [key, inner] : [inner, key];
      return addRule(bcc, { value: value[inner], prop, width });
    }, acc);
  }, {});
}

function isZero(v) { return v === '0' || v === 0; }
function isNumeric(s) { return !isNaN(parseFloat(s)) && isFinite(s); }

export default preprocess;
