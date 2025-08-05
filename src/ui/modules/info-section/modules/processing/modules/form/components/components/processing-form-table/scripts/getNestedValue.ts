import { get } from 'lodash-es';
/**
 * This function retrieves a nested value from an object based on a given path array.
 * It first attempts to use lodash's `get` function, and if that fails, it manually traverses the object.
 * If the value is an array, it processes each item in the array to extract the nested value.
 *
 * @param {Object} value - The object from which to retrieve the nested value.
 * @param {string[]} pathArray - An array of strings representing the path to the nested value.
 * @returns {string} - The retrieved nested value, or an empty string if not found.
 */

export default function getNestedValue(value, pathArray: string[]) {
  if (!value) return '';
  if (!pathArray.length) return value; // if pathArray is empty it means we don't need to get nested value, return value as is @author @liza-pohranichna

  // check is lodash-get work with current path
  // @author @liza-pohranichna
  const nestedValue = get(value, pathArray);
  if (nestedValue) return nestedValue;

  // if lodash-get not work, we need to go through pathArray manually
  // @author @liza-pohranichna
  if (Array.isArray(value)) { // if value is array, we need to iterate every item in array and get nested value from EVERY item @author @liza-pohranichna
    return value
    .map((object) => getNestedValue(object, pathArray))
    ?.filter(Boolean) // filter out empty values
    .join(', '); // join values with comma

    // Example: We have array of permissions:[{ name:'PN1' }, { name:'PN2' }, { name:'PN3' }] and need to take permissions.name
    // Result will be 'PN1, PN2, PN3'
    // @author @liza-pohranichna
  } else if (typeof value === 'object') { // if value is object, we just need to go deeper into the object
    const [firstStep, ...restPath] = pathArray;

    return getNestedValue(value[firstStep], restPath);

    // Example: value:{ emails:{ data:[{ type:{ name:'Email1' } }, { type:{ name:'Email2' } }] }}
    // pathArray:['emails', 'data', 'type', 'name']
    // value['emails']: { data: [{ type: { name: 'Email1' } }, { type: { name: 'Email2' } }] },
    // restPath: ['data', 'type', 'name']
    // @author @liza-pohranichna
  }
  return value; // if value is not array or object, return value as it is @author @liza-pohranichna
}
