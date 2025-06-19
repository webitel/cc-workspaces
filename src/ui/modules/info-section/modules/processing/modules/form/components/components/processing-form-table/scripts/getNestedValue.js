export default function getNestedValue(parentValue, path) {
  let nestedValue;

  if (path.length <= 1) return parentValue || '';

  // @author @liza-pohranichna
  // delete current path step before next step
  const newPath = path.slice(1);

  // @author @liza-pohranichna
  // take key of object for current path step
  const key = newPath[0];

  if (Array.isArray(parentValue) && typeof parentValue[0] === 'object') {
    // @author @liza-pohranichna
    // get needed value from every object in array
    nestedValue = parentValue.map((object) => getNestedValue(object[key], newPath)).join(', ');
  } else if (typeof parentValue === 'object') {
    nestedValue = getNestedValue(parentValue[key], newPath);
  } else nestedValue = parentValue || '';

  return nestedValue;
}
