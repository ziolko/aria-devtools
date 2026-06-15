import { expect } from "chai";
import traverse from "../src/AOM/traverse";
import Observer from "../src/store/observer";
import { getNodeKey } from "../src/AOM/utils";
import { NodeElement, TextElement } from "../src/AOM/types";

type AnyEl = NodeElement | TextElement;

// Shadow roots are attached to plain <div>s (no custom elements) so the tests
// don't depend on class-to-ES5 transpilation of HTMLElement subclasses.
describe("Shadow DOM / slots", () => {
  const mounted: HTMLElement[] = [];

  afterEach(() => {
    while (mounted.length) mounted.pop()!.remove();
  });

  function mount(el: HTMLElement) {
    document.body.appendChild(el);
    mounted.push(el);
    return el;
  }

  function host(shadowHtml: string, lightHtml: string): HTMLElement {
    const el = document.createElement("div");
    el.attachShadow({ mode: "open" }).innerHTML = shadowHtml;
    el.innerHTML = lightHtml;
    return el;
  }

  function flatten(node: AnyEl | null | undefined): AnyEl[] {
    const out: AnyEl[] = [];
    const walk = (n: AnyEl | null | undefined) => {
      if (!n) return;
      out.push(n);
      if (n instanceof NodeElement) n.htmlChildren.forEach(walk);
    };
    walk(node);
    return out;
  }

  const ids = (node: AnyEl) =>
    flatten(node)
      .filter((x): x is NodeElement => x instanceof NodeElement)
      .map(x => x.domNode.id)
      .filter(Boolean);

  const tags = (node: AnyEl) =>
    flatten(node)
      .filter((x): x is NodeElement => x instanceof NodeElement)
      .map(x => x.htmlTag);

  const texts = (node: AnyEl) =>
    flatten(node)
      .filter((x): x is TextElement => x instanceof TextElement)
      .map(x => x.text.trim())
      .filter(Boolean);

  it("Should surface slotted light-DOM content assigned to a default slot", () => {
    const el = mount(
      host(`<div class="card-shell"><slot></slot></div>`, `<button id="slotted-button">Slotted</button>`)
    );

    const tree = traverse(el) as NodeElement;

    expect(tags(tree)).to.include("div");
    expect(ids(tree)).to.include("slotted-button");
    expect(texts(tree)).to.include("Slotted");
  });

  it("Should render slot fallback content when nothing is assigned", () => {
    const el = mount(host(`<slot><span id="fb">fallback content</span></slot>`, ``));

    const tree = traverse(el) as NodeElement;

    expect(ids(tree)).to.include("fb");
    expect(texts(tree)).to.include("fallback content");
  });

  it("Should resolve named slots and the default slot independently", () => {
    const el = mount(
      host(
        `<slot name="title"></slot><div class="body"><slot></slot></div>`,
        `<h2 id="title" slot="title">The title</h2><p id="body">The body</p>`
      )
    );

    const tree = traverse(el) as NodeElement;

    expect(ids(tree)).to.include("title");
    expect(ids(tree)).to.include("body");
    expect(texts(tree)).to.include("The title");
    expect(texts(tree)).to.include("The body");
  });

  it("Should follow slots across nested shadow roots", () => {
    // Mirrors <swiper-container><swiper-slide>…</swiper-slide></swiper-container>:
    // an outer host that slots in an inner host that slots in the real content.
    const inner = host(`<div class="slide-shell"><slot></slot></div>`, `<a id="deep-link" href="#">Deep link</a>`);
    inner.id = "inner";

    const outer = document.createElement("div");
    outer.attachShadow({ mode: "open" }).innerHTML = `<div class="wrapper"><slot></slot></div>`;
    outer.appendChild(inner);
    mount(outer);

    const tree = traverse(outer) as NodeElement;

    expect(ids(tree)).to.include("deep-link");
    expect(ids(tree).filter(id => id === "inner").length, "traversed once").to.equal(1);
    expect(ids(tree).filter(id => id === "deep-link").length, "traversed once").to.equal(1);
    expect(texts(tree)).to.include("Deep link");
  });

  it("Should react to slotted content being added dynamically", async () => {
    const container = document.createElement("div");
    const slideHost = host(`<div class="shell"><slot></slot></div>`, `<button id="first">First</button>`);
    container.appendChild(slideHost);
    mount(container);

    const observer = new Observer(container);
    try {
      const buttonIds = () => {
        const root = observer.store.getElement(getNodeKey(container)) as NodeElement;
        return ids(root).filter(id => id === "first" || id === "second");
      };

      expect(buttonIds()).to.deep.equal(["first"]);

      const second = document.createElement("button");
      second.id = "second";
      second.textContent = "Second";
      slideHost.appendChild(second);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(buttonIds()).to.deep.equal(["first", "second"]);
    } finally {
      observer.disconnect();
    }
  });
});
