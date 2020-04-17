import { contextToString, escapeXml } from "./helper";
import { Value, ValueContext } from "./value";

export type Args = {
  class?: (string | null)[];
  dynClass?: (signal: ValueContext | null) => (string | null)[];
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onMouseOver?: () => void;
  title?: string;
  data?: { [name: string]: string };
  id?: string;
  style?: string;
  dynStyle?: (signal: ValueContext | null) => string;
};

export abstract class ElementBase {
  abstract renderString: (context: number[]) => Promise<string>;

  abstract renderNode: (context: number[]) => Promise<Node>;
}

export abstract class HtmlElement<
  TArgs extends {},
  TChildren extends ElementBase
> {
  constructor(
    private name: string,
    protected args: TArgs,
    private children: TChildren[]
  ) {}

  async renderArgs(context: number[]): Promise<{ [key: string]: string }> {
    const result = {} as { [key: string]: string };

    return result;
  }

  renderString = async (context: number[]) => {
    let renderedChildren = "";
    for (let i = 0; i < this.children.length; i++) {
      const c = this.children[i];
      const newContext = context.slice();
      newContext.push(i);
      renderedChildren += await c.renderString(newContext);
    }

    let argsString = "";
    const args = await this.renderArgs(context);
    for (const key of Object.keys(args)) {
      argsString += ` ${key}="${args[key]}"`;
    }

    return `<${this.name}${argsString}>${renderedChildren}</${this.name}>`;
  };

  async renderNode(context: number[]) {
    const result = document.createElement(this.name);

    for (let i = 0; i < this.children.length; i++) {
      const c = this.children[i];
      const newContext = context.slice();
      newContext.push(i);
      result.appendChild(await c.renderNode(newContext));
    }

    const args = await this.renderArgs(context);
    for (const key of Object.keys(args)) {
      result.setAttribute(key, args[key]);
    }

    return result;
  }
}

export abstract class HtmlBlockElement<
  TArgs extends Args,
  TChildren extends ElementBase
> extends HtmlElement<TArgs, TChildren> {
  constructor(name: string, args: TArgs, children: TChildren[]) {
    super(name, args, children);
  }

  async renderArgs(context: number[]): Promise<{ [key: string]: string }> {
    const result = {} as { [key: string]: string };

    if (this.args.title !== undefined) {
      result.title = this.args.title;
    }

    const styles = [
      ...(this.args.style === undefined ? [] : [this.args.style]),
      ...(this.args.dynStyle === undefined ? [] : [this.args.dynStyle(null)]),
    ];

    if (styles.length > 0) {
      result.style = styles.join(" ");
    }

    if (this.args.id !== undefined) {
      result.id = this.args.id;
    }

    const classes = [
      ...(this.args.class === undefined ? [] : this.args.class),
      ...(this.args.dynClass === undefined ? [] : this.args.dynClass(null)),
    ].filter((c) => c !== null);

    if (classes.length > 0) {
      result.class = classes.join(" ");
    }

    if (this.args.data !== undefined) {
      for (const key in this.args.data) {
        result[`data-${key}`] = this.args.data[key];
      }
    }

    const addEvent = (event: keyof TArgs, jsEvent: string) => {
      if (this.args[event] !== undefined) {
        const m = contextToString(jsEvent, context);
        result[event as string] = `__handle.${m}()`;
        if (typeof window !== "undefined") {
          (window as any).__handle[m] = this.args[event];
        }
      }
    };

    addEvent("onClick", "click");
    addEvent("onMouseEnter", "mouseenter");
    addEvent("onMouseLeave", "mouseleave");
    addEvent("onMouseOver", "mouseover");

    if (this.args.onClick !== undefined) {
      const m = contextToString("click", context);
      result.onClick = `__handle.${m}()`;
      if (typeof window !== "undefined") {
        (window as any).__handle[m] = this.args.onClick;
      }
    }

    return result;
  }

  async renderNode(context: number[]) {
    const node = await super.renderNode(context);

    if (this.args.dynClass !== undefined) {
      const _this = this;
      async function update() {
        if (_this.args.dynClass !== undefined) {
          const classes = [
            ...(_this.args.class === undefined ? [] : _this.args.class),
            ..._this.args.dynClass(update),
          ];
          node.className = classes.filter((c) => c !== null).join(" ");
        }
      }

      await update();
    }

    if (this.args.dynStyle !== undefined) {
      const _this = this;
      async function update() {
        if (_this.args.dynStyle !== undefined) {
          const s = _this.args.dynStyle(update);
          node.setAttribute("style", s);
        }
      }

      await update();
    }

    return node;
  }
}
/**
 * Page
 */

export class Page {
  constructor(public body: Body) {}
}

export function page(body: Body) {
  return new Page(body);
}

/**
 * Html
 */

class Html extends HtmlElement<{}, ElementBase> {
  constructor(head: Head, body: Body) {
    super("html", {}, [head, body]);
  }
}

export function html(head: Head, body: Body) {
  return new Html(head, body);
}

/**
 * Head
 */

type HeadChildren = Script | Link | Meta;

class Head extends HtmlElement<{}, HeadChildren> {
  constructor(children: HeadChildren[]) {
    super("head", {}, children);
  }
}

export function head(children: HeadChildren[]) {
  return new Head(children);
}

/**
 * Body
 */

export class Body extends HtmlElement<Args, ElementBase> {
  constructor(args: Args, children: ElementBase[]) {
    super("body", args, children);
  }
}

export function body(args: Args, children: ElementBase[]) {
  return new Body(args, children);
}

/**
 * Script
 */

type ScriptArgs = { src: string; defer?: boolean; async?: boolean };

class Script extends HtmlElement<ScriptArgs, never> {
  constructor(args: ScriptArgs) {
    super("script", args, []);
  }

  async renderArgs(context: number[]) {
    let result = await super.renderArgs(context);
    if (this.args.defer === true) {
      result.defer = "";
    }

    if (this.args.async === true) {
      result.async = "";
    }

    result.src = this.args.src;

    return result;
  }
}

export function script(args: ScriptArgs) {
  return new Script(args);
}

/**
 * Meta
 */

type MetaArgs = { charset: "utf-8" | "windows-1252" };

class Meta extends HtmlElement<MetaArgs, never> {
  constructor(args: MetaArgs) {
    super("meta", args, []);
  }

  async renderArgs(context: number[]) {
    const result = await super.renderArgs(context);
    result.charset = this.args.charset;

    return result;
  }
}

export function meta(args: MetaArgs) {
  return new Meta(args);
}

/**
 * Link
 */

type LinkArgs = { rel: "stylesheet"; href: string };

class Link extends HtmlElement<LinkArgs, never> {
  constructor(args: LinkArgs) {
    super("link", args, []);
  }

  async renderArgs(context: number[]) {
    const result = await super.renderArgs(context);
    result.rel = this.args.rel;
    result.href = this.args.href;

    return result;
  }
}

export function link(args: LinkArgs) {
  return new Link(args);
}

/**
 * Div
 */

class Div extends HtmlBlockElement<Args, ElementBase> {
  constructor(args: Args, children: ElementBase[]) {
    super("div", args, children);
  }
}

export function div(args: Args, children: ElementBase[]) {
  return new Div(args, children);
}

/**
 * P
 */

type PArgs = Args;

type PChildren = ElementBase;

class P extends HtmlBlockElement<Args, PChildren> {
  constructor(args: PArgs, children: PChildren[]) {
    super("p", args, children);
  }
}

export function p(args: PArgs, children: PChildren[]) {
  return new P(args, children);
}

/**
 * Strong
 */

type StrongArgs = Args;

type StrongChildren = ElementBase;

class Strong extends HtmlBlockElement<StrongArgs, StrongChildren> {
  constructor(args: StrongArgs, children: StrongChildren[]) {
    super("strong", args, children);
  }
}

export function strong(args: StrongArgs, children: StrongChildren[]) {
  return new Strong(args, children);
}

/**
 * Span
 */

type SpanArgs = Args;

type SpanChildren = ElementBase;

class Span extends HtmlBlockElement<SpanArgs, SpanChildren> {
  constructor(args: SpanArgs, children: SpanChildren[]) {
    super("span", args, children);
  }
}

export function span(args: SpanArgs, children: SpanChildren[]) {
  return new Span(args, children);
}

/**
 * Img
 */

type ImgArgs = Args & { src: string };

class Img extends HtmlBlockElement<ImgArgs, never> {
  constructor(args: ImgArgs) {
    super("img", args, []);
  }

  async renderArgs(context: number[]) {
    const result = await super.renderArgs(context);
    result.src = this.args.src;

    return result;
  }
}

export function img(args: ImgArgs) {
  return new Img(args);
}

/**
 * Br
 */

class Br extends HtmlBlockElement<{}, never> {
  constructor() {
    super("br", {}, []);
  }
}

export function br() {
  return new Br();
}

/**
 * A
 */

type AArgs = Args & { link: Promise<Page> };

export class A extends HtmlBlockElement<AArgs, ElementBase> {
  constructor(args: AArgs, children: ElementBase[]) {
    super("a", args, children);
  }

  async renderArgs(context: number[]) {
    const result = await super.renderArgs(context);
    const link = (await this.args.link) as any;
    const str = link[1]
      .map((l: string) => "/" + encodeURIComponent(JSON.stringify(l)))
      .join("");
    result.href = link[0] + str;
    return result;
  }
}

export function a(args: AArgs, children: ElementBase[]) {
  return new A(args, children);
}

/**
 * Button
 */

type ButtonArgs = Args;

export class Button extends HtmlBlockElement<ButtonArgs, Text> {
  constructor(args: ButtonArgs, content: string) {
    super("button", args, [new Text(content)]);
  }
}

export function button(args: ButtonArgs, content: string) {
  return new Button(args, content);
}

/**
 * Input
 */

export class Input extends HtmlBlockElement<Args, never> {
  constructor(args: Args, private value: Value<string>) {
    super("input", args, []);
  }

  async renderArgs(context: number[]) {
    let result = await super.renderArgs(context);

    const m = contextToString("input", context);
    result.value = escapeXml(this.value.get(null));
    result.onInput = `__handle.${m}(event)`;
    if (typeof window !== "undefined") {
      (window as any).__handle[m] = (e: InputEvent) => {
        this.value.set((e.currentTarget as HTMLInputElement).value);
      };
    }

    return result;
  }
}

export function input(args: Args, value: Value<string>) {
  return new Input(args, value);
}

/**
 * TextArea
 */

export class TextArea extends HtmlBlockElement<Args, never> {
  constructor(args: Args, private value: Value<string>) {
    super("textarea", args, []);
  }

  async renderArgs(context: number[]) {
    let result = await super.renderArgs(context);

    const m = contextToString("input", context);
    result.value = escapeXml(this.value.get(null));
    result.onInput = `__handle.${m}(event)`;
    if (typeof window !== "undefined") {
      (window as any).__handle[m] = (e: InputEvent) => {
        this.value.set((e.currentTarget as HTMLInputElement).value);
      };
    }

    return result;
  }
}

export function textarea(args: Args, value: Value<string>) {
  return new TextArea(args, value);
}

/**
 * Table
 */

type TableArgs = {} & Args;

type TableChildren = THead | TBody | Dyn;

export class Table extends HtmlBlockElement<TableArgs, TableChildren> {
  constructor(args: TableArgs, children: TableChildren[]) {
    super("table", args, children);
  }
}

export function table(args: TableArgs, children: TableChildren[]) {
  return new Table(args, children);
}

/**
 * THead
 */

type THeadArgs = {};
type THeadChildren = Tr;

export class THead extends HtmlBlockElement<THeadArgs, THeadChildren> {
  constructor(args: THeadArgs, children: THeadChildren[]) {
    super("thead", args, children);
  }
}

export function thead(args: THeadArgs, children: THeadChildren[]) {
  return new THead(args, children);
}

/**
 * TBody
 */

type TBodyArgs = {};
type TBodyChildren = Tr;

export class TBody extends HtmlBlockElement<TBodyArgs, TBodyChildren> {
  constructor(args: TBodyArgs, children: TBodyChildren[]) {
    super("tbody", args, children);
  }
}

export function tbody(args: TBodyArgs, children: TBodyChildren[]) {
  return new TBody(args, children);
}

/**
 * Tr
 */

type TrArgs = {};
type TrChildren = Td | Th;

export class Tr extends HtmlBlockElement<TrArgs, TrChildren> {
  constructor(args: TrArgs, children: TrChildren[]) {
    super("tr", args, children);
  }
}

export function tr(args: TrArgs, children: TrChildren[]) {
  return new Tr(args, children);
}

/**
 * Td
 */

type TdArgs = Args & { colspan?: number };
type TdChildren = ElementBase;

export class Td extends HtmlBlockElement<TdArgs, TdChildren> {
  constructor(args: TdArgs, children: TdChildren[]) {
    super("td", args, children);
  }

  async renderArgs(context: number[]) {
    const result = await super.renderArgs(context);

    if (this.args.colspan !== undefined) {
      result.colspan = this.args.colspan.toString();
    }

    return result;
  }
}

export function td(args: TdArgs, children: TdChildren[]) {
  return new Td(args, children);
}

/**
 * Th
 */

type ThArgs = {};
type ThChildren = ElementBase;

export class Th extends HtmlBlockElement<ThArgs, ThChildren> {
  constructor(args: ThArgs, children: ThChildren[]) {
    super("th", args, children);
  }
}

export function th(args: ThArgs, children: ThChildren[]) {
  return new Th(args, children);
}

/**
 * Text
 */

export class Text extends ElementBase {
  constructor(private text: string) {
    super();
  }

  renderString = async () => escapeXml(this.text);

  renderNode = async () => document.createTextNode(this.text);
}

export function text(text: string) {
  return new Text(text);
}

/**
 * Dyn
 */

export class Dyn extends ElementBase {
  private node: Node | null = null;
  private context: number[] = [];
  private renderPending = false;

  constructor(
    private signal: (context: ValueContext | null) => Promise<ElementBase>
  ) {
    super();
  }

  update = async () => {
    if (!this.renderPending) {
      this.renderPending = true;
      requestAnimationFrame(async () => {
        this.renderPending = false;
        const element = this.node as Element | null;
        if (element !== null) {
          const newNode = await this.renderNode(this.context);
          element.replaceWith(newNode);
        }
      });
    }
  };

  renderString = async (context: number[]) => {
    const element = await this.signal(null);
    return element.renderString(context);
  };

  renderNode = async (context: number[]) => {
    this.context = context;
    const element = await this.signal(this.update);
    const node = await element.renderNode(context);
    // if (this.node === null) {
    this.node = node;
    // }

    return node;
  };
}

export function dyn(
  signal: (context: ValueContext | null) => Promise<ElementBase>
) {
  return new Dyn(signal);
}
