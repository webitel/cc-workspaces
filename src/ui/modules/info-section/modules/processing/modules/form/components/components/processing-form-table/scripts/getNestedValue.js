import get from 'lodash/get';

export default function getNestedValue(currentValue, arrayPath) {
  if (!currentValue) return '';
  if (!arrayPath.length) return currentValue;

  // @author @liza-pohranichna
  // check is lodash-get work with current path
  const value = get(currentValue, arrayPath);

  if (value) return value;

  // @author @liza-pohranichna
  // start main logic after all checking:
  const [step, ...restPath] = arrayPath; // @author @liza-pohranichna Example: step:'contact', restPath:['emails', '5', 'type']

  if (Array.isArray(currentValue)) {
    return currentValue // get value from every object in array @author @liza-pohranichna
    .map((object) => getNestedValue(object[step], restPath))
    ?.filter(Boolean)
    .join(', ');

  } else if (typeof currentValue === 'object') {

    return getNestedValue(currentValue[step], restPath);

  } else return currentValue;
}
