export function capitalize(text) {
  return text
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
