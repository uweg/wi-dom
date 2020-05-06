import { div, dyn, text, select } from "../src/elements";
import { Value } from "../src/lib";

function animationFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      resolve();
    });
  });
}

test("render", async () => {
  const element = div({ class: ["c"] }, []);
  expect(await element.renderString([])).toEqual(`<div class="c"></div>`);
  expect((await element.renderNode([]))[0].outerHTML).toEqual(
    `<div class="c"></div>`
  );
});

test("dyn", async () => {
  const value = new Value(false);
  const element = dyn(async (s) => {
    return [text(value.get(s) ? "true" : "false")];
  });

  const container = document.createElement("div");
  container.append(...(await element.renderNode([])));
  expect(container.textContent).toEqual("false");

  value.set(true);
  await animationFrame();
  expect(container.textContent).toEqual("true");
});

test("nested dyn", async () => {
  // nested dyns do not unsubscribe when parent dyn rerenders.

  const child = new Value(false);
  const parent = new Value(false);
  let rendered = 0;
  const element = dyn(async (s) => {
    const p = parent.get(s);
    return [
      dyn(async (s) => {
        rendered += 1;
        const c = child.get(s);
        return [text(`${child.get(s)}`)];
      }),
    ];
  });

  await element.renderNode([]);
  expect(rendered).toEqual(1);

  parent.set(true);
  await animationFrame();
  expect(rendered).toEqual(2);

  child.set(true);
  await animationFrame();
  expect(rendered).toEqual(3);
  // Nested dyn should only be rendered once here. But not sure on how to do this yet.
});

test("select", async () => {
  (window as any).__handle = {};
  const value = new Value(1);
  const element = select({}, value, [
    { caption: "one", value: 1 },
    { caption: "two", value: 2 },
  ]);
  expect(await element.renderString([])).toEqual(
    `<select onInput="__handle.change_(event)"><option value="0" selected="selected">one</option><option value="1">two</option></select>`
  );
});
