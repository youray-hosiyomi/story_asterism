export type CNObject = Record<string, boolean>;

export function cnByObject(obj: CNObject) {
  return Object.keys(obj)
    .reduce((prev, key) => {
      if (obj[key]) return prev.concat(key);
      return prev;
    }, [] as string[])
    .join(" ");
}
