import { div, dyn, text } from "../src/elements";
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
  expect((await element.renderNode([])).outerHTML).toEqual(
    `<div class="c"></div>`
  );
});

test("dyn", async () => {
  const value = new Value(false);
  const element = dyn(async (s) => {
    return text(value.get(s) ? "true" : "false");
  });

  const container = document.createElement("div");
  container.appendChild(await element.renderNode([]));
  expect(container.textContent).toEqual("false");

  value.set(true);
  await animationFrame();
  expect(container.textContent).toEqual("true");
});
