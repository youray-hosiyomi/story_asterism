type CompareHandler<Data> = (data: Data) => number | string;
type CompareFn<Data> = (a: Data, b: Data) => number;
export function makeCompareFn<Data>(handlers: CompareHandler<Data>[], isAsc: boolean = true): CompareFn<Data> {
  return (a, b) => {
    for (let index = 0; index < handlers.length; index++) {
      const handler = handlers[index];
      if (handler(a) < handler(b)) return isAsc ? -1 : 1;
      if (handler(a) > handler(b)) return isAsc ? 1 : -1;
    }
    return 0;
  };
}
