export default function getPathArray(path: string, separator: string = '.'): string[] {
  // @author @liza-pohranichna
  // method reformatting string path to array.
  // Example: 'contact.emails[11].update_by.name' ====> ['contact', 'emails', '11', 'update_by', 'name']
  const stringFieldPath = path.replaceAll(/[\[\]]/g, separator);
  const arrayFieldPath = stringFieldPath.includes(separator)
    ? stringFieldPath.split(separator)
    : [stringFieldPath];

  return arrayFieldPath.filter(Boolean);
}
