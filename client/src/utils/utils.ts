export function getKeysFromObject<T>(formFields: T) {
  return Object.keys(formFields as object).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: curr,
    }),
    {}
  ) as {
    [k in keyof T]: k;
  };
}

export function toTitleCase(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}
