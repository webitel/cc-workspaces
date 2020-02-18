const snakeToCamel = (str) => str.replace(
  /([-_][a-z])/g,
  (group) => group.toUpperCase()
    .replace('-', '')
    .replace('_', ''),
);

const camelToSnake = (str) => str.replace(
  /([A-Z])/g,
  (group) => group.toLowerCase()
    .replace('', '_'),
);

export const objSnakeToCamel = (obj) => {
  const newObj = {};
  if (Array.isArray(obj)) {
    return obj.map((value) => {
      if (typeof value === 'object') {
        return objSnakeToCamel(value);
      }
      return value;
    });
  }
  Object.keys(obj)
    .forEach((oldKey) => {
      if (oldKey === 'schema') {
        newObj[oldKey] = obj[oldKey];
      } else {
        const newKey = snakeToCamel(oldKey);
        let value = obj[oldKey];
        if (Array.isArray(value) || (value !== null && value.constructor === Object)) {
          value = objSnakeToCamel(value);
        }
        newObj[newKey] = value;
      }
    });

  return newObj;
};

export const objCamelToSnake = (obj) => {
  const newObj = {};
  if (Array.isArray(obj)) {
    return obj.map((value) => {
      if (typeof value === 'object') {
        return objCamelToSnake(value);
      }
      return value;
    });
  }
  Object.keys(obj)
    .forEach((oldKey) => {
      if (oldKey === 'schema') {
        newObj[oldKey] = obj[oldKey];
      } else {
        const newKey = camelToSnake(oldKey);
        let value = obj[oldKey];
        if (Array.isArray(value) || (value !== null && value.constructor === Object)) {
          value = objCamelToSnake(value);
        }
        newObj[newKey] = value;
      }
    });

  return newObj;
};
