import DocumentListener from './DocumentListener';
import interpolate, { expandLookRules } from './interpolate';
import wrapComponent from './wrapComponent';

function superficial(component) {
  return wrapComponent(component);
}

export default superficial;
export { interpolate, expandLookRules, DocumentListener };
