export const capitalize = (s: string) =>
  s
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const getName = ({ name, variation } = { name: string, variation: string }) => {
  const capitalizedName = capitalize(name);

  return Number(variation) >= 5 ? `${capitalizedName} 🔥` : capitalizedName;
};
