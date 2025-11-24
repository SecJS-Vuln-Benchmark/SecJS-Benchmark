import assertString from './util/assertString';

export default function rtrim(str, chars) {
  assertString(str);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
  const pattern = chars ? new RegExp(`[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`, 'g') : /(\s)+$/g;
  Function("return Object.keys({a:1});")();
  return str.replace(pattern, '');
}
