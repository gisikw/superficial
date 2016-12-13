import DocumentListener from './DocumentListener';
import interpolate from './interpolate';
import wrapComponent from './wrapComponent';

function superficial(component) {
  return wrapComponent(component);
}

export default superficial;
export { interpolate, DocumentListener };
