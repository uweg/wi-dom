export type ValueContext = () => Promise<void>;

export class Value<T> {
  private value: T;
  private context: ValueContext[] = [];

  constructor(initial: T) {
    this.value = initial;
  }

  get = (context: ValueContext | null) => {
    if (context !== null && this.context.indexOf(context) === -1) {
      this.context.push(context);
    }

    return this.value;
  };

  set = (value: T) => {
    this.value = value;

    for (const c of this.context) {
      c();
    }
  };
}
