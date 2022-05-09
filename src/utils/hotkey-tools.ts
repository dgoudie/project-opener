export function decodeHotKey(encodedHotKey: string) {
  const keys = [];
  const encodedKeys = encodedHotKey.split('+');
  if (encodedKeys.indexOf('CommandOrControl') >= 0) {
    keys.push('ctrl');
  }
  if (encodedKeys.indexOf('Alt') >= 0) {
    keys.push('alt');
  }
  if (encodedKeys.indexOf('Shift') >= 0) {
    keys.push('shift');
  }
  keys.push(encodedKeys[encodedKeys.length - 1].toLowerCase());
  return keys;
}

export function encodeHotKey(decodedHotKey: string[]) {
  const encodedHotKey = [];
  if (decodedHotKey.indexOf('ctrl') >= 0) {
    encodedHotKey.push('CommandOrControl');
  }
  if (decodedHotKey.indexOf('alt') >= 0) {
    encodedHotKey.push('Alt');
  }
  if (decodedHotKey.indexOf('shift') >= 0) {
    encodedHotKey.push('Shift');
  }
  encodedHotKey.push(decodedHotKey[decodedHotKey.length - 1].toUpperCase());
  return encodedHotKey.join('+');
}
