export default function(ms) {
  const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
  return  new Date(Number(ms)).toLocaleDateString([], options);
}
