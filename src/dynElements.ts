import { Args, dyn, input, ElementBase, Input } from "./elements";
import { Value } from "./value";

/**
 * Input
 */

export class DynInput extends ElementBase {
  constructor(private args: Args, private value: Value<string>) {
    super();
  }

  renderNode = async (context: number[]) => {
    const input = new Input({ ...this.args, onInput: this.value.set }, "");
    const node = await input.renderNode(context);

    const _this = this;
    async function update() {
      const v = _this.value.get(update);
      (node[0] as HTMLInputElement).value = v;
    }

    update();

    return node;
  };

  renderString = async (context: number[]) => {
    const input = new Input(
      { ...this.args, onInput: () => {} },
      this.value.get(null)
    );

    return input.renderString(context);
  };
}

export function dynInput(args: Args, value: Value<string>) {
  return new DynInput(args, value);
}
