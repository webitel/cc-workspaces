export const truncate = (value, length) => {
  if (value) {
    if (value.length < length) return value;
    return `${value.slice(0, length - 3)}...`;
  }
  return '';
};

export const truncateFromEnd = (value, length) => {
  if (value) {
    if (value.length < length) return value;
    return `${value.slice(value.length - (length - 3))}...`;
  }
  return '';
};
