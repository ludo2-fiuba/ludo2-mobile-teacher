import lodash from 'lodash';

function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function convertSnakeToCamelCase(obj: any): any {
  if (!isObject(obj)) return obj;

  return Object.keys(obj).reduce((acc: any, key: any) => {
    const camelKey = lodash.camelCase(key);
    let value = obj[key];

    // If the value is an object, recursively apply conversion
    if (isObject(value)) {
      value = convertSnakeToCamelCase(value);
    }

    acc[camelKey] = value;
    return acc;
  }, {});
}