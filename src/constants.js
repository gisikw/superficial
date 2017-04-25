export const PRECISION = 100;
export const STATIC_VALUES = ['auto', 'none', 'inherit'];
export const SUPPORTED_UNITS = [
  'em', 'ex', 'rem', '%', 'px', 'vh', 'vw', 'vmin', 'vmax',
  ];

export const UNIT_PATTERN =
  new RegExp(`-?(\\d+)(?:\\.\\d+)?(${
    SUPPORTED_UNITS.map(u => `(${u})`).join('|')
  })?`);
export const STATIC_PATTERN = STATIC_VALUES.map(v => `(${v})`).join('|');
export const VALUE_PATTERN =
  new RegExp(`(${UNIT_PATTERN.source})|(${STATIC_PATTERN})`, 'g');
export const SINGLE_UNIT = new RegExp(`^${UNIT_PATTERN.source}$`);
