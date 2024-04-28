export class MultiStocker<Data> {
  protected record: Record<string, Data[]>;
  protected data2key: (data: Data) => string;
  constructor(data2key: (data: Data) => string, initRecord: Record<string, Data[]> = {}) {
    this.data2key = data2key;
    this.record = initRecord;
  }
  getRecord(): Record<string, Data[]> {
    return this.record;
  }
  get(key: string): Data[] {
    return this.record[key] ?? [];
  }
  getAll(): Data[] {
    return Object.keys(this.record).reduce((prev: Data[], key) => prev.concat(...this.get(key)), []);
  }
  set(data: Data): MultiStocker<Data> {
    const key = this.data2key(data);
    this.record[key] = this.get(key).concat(data);
    return this;
  }
  setAll(list: Data[]): MultiStocker<Data> {
    list.forEach((data) => this.set(data));
    return this;
  }
}

export function multiStock<Data>(
  data2key: (data: Data) => string,
  initRecord: Record<string, Data[]> = {},
): MultiStocker<Data> {
  return new MultiStocker(data2key, initRecord);
}

export class SingleStocker<Data> {
  protected record: Record<string, Data>;
  protected data2key: (data: Data) => string;
  constructor(data2key: (data: Data) => string, initRecord: Record<string, Data> = {}) {
    this.data2key = data2key;
    this.record = initRecord;
  }
  getRecord(): Record<string, Data> {
    return this.record;
  }
  get(key: string): Data | null {
    return this.record[key] ?? null;
  }
  getAll(): Data[] {
    return Object.keys(this.record).reduce((prev: Data[], key) => {
      const data = this.get(key);
      return data ? prev.concat(data) : prev;
    }, []);
  }
  set(data: Data): SingleStocker<Data> {
    const key = this.data2key(data);
    this.record[key] = data;
    return this;
  }
  setAll(list: Data[]): SingleStocker<Data> {
    list.forEach((data) => this.set(data));
    return this;
  }
  foreach(func: (data: Data, key: string) => void): void {
    Object.keys(this.record).forEach((key) => {
      const data = this.get(key);
      if (data) func(data, key);
    });
  }
}

export function singleStock<Data>(
  data2key: (data: Data) => string,
  initRecord: Record<string, Data> = {},
): SingleStocker<Data> {
  return new SingleStocker(data2key, initRecord);
}
